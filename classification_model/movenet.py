"""
Pose estimation module using MoveNet TFLite model.
Adapted and optimized from the TensorFlow examples repository.
"""

import os
from typing import Dict, List, Tuple
import cv2
import numpy as np

from bodyPart import BodyPart, Person, person_from_keypoints_with_scores

try:
    from tflite_runtime.interpreter import Interpreter
except ImportError:
    import tensorflow as tf
    Interpreter = tf.lite.Interpreter


class Movenet:
    _MIN_CROP_KEYPOINT_SCORE = 0.2
    _TORSO_EXPANSION_RATIO = 1.9
    _BODY_EXPANSION_RATIO = 1.2

    def __init__(self, model_path: str) -> None:
        if not os.path.splitext(model_path)[1]:
            model_path += ".tflite"

        self._interpreter = Interpreter(model_path=model_path, num_threads=4)
        self._interpreter.allocate_tensors()

        input_details = self._interpreter.get_input_details()[0]
        output_details = self._interpreter.get_output_details()[0]

        self._input_index = input_details['index']
        self._output_index = output_details['index']
        self._input_height = input_details['shape'][1]
        self._input_width = input_details['shape'][2]
        self._crop_region = None

    def init_crop_region(self, image_height: int, image_width: int) -> Dict[str, float]:
        if image_width > image_height:
            y_min = (image_height / 2 - image_width / 2) / image_height
            box_height = image_width / image_height
            x_min = 0.0
            box_width = 1.0
        else:
            x_min = (image_width / 2 - image_height / 2) / image_width
            box_width = image_height / image_width
            y_min = 0.0
            box_height = 1.0

        return {
            'y_min': y_min,
            'x_min': x_min,
            'y_max': y_min + box_height,
            'x_max': x_min + box_width,
            'height': box_height,
            'width': box_width
        }

    def _torso_visible(self, keypoints: np.ndarray) -> bool:
        scores = keypoints[:, 2]
        return (
            (scores[BodyPart.LEFT_HIP.value] > self._MIN_CROP_KEYPOINT_SCORE or
             scores[BodyPart.RIGHT_HIP.value] > self._MIN_CROP_KEYPOINT_SCORE) and
            (scores[BodyPart.LEFT_SHOULDER.value] > self._MIN_CROP_KEYPOINT_SCORE or
             scores[BodyPart.RIGHT_SHOULDER.value] > self._MIN_CROP_KEYPOINT_SCORE)
        )

    def _determine_torso_and_body_range(self, keypoints, target_keypoints, center_y, center_x):
        torso_joints = [
            BodyPart.LEFT_SHOULDER, BodyPart.RIGHT_SHOULDER,
            BodyPart.LEFT_HIP, BodyPart.RIGHT_HIP
        ]

        max_torso_yrange = max(abs(center_y - target_keypoints[j][0]) for j in torso_joints)
        max_torso_xrange = max(abs(center_x - target_keypoints[j][1]) for j in torso_joints)

        max_body_yrange = max_body_xrange = 0.0
        for i in range(len(BodyPart)):
            if keypoints[i, 2] < self._MIN_CROP_KEYPOINT_SCORE:
                continue
            dy = abs(center_y - target_keypoints[BodyPart(i)][0])
            dx = abs(center_x - target_keypoints[BodyPart(i)][1])
            max_body_yrange = max(max_body_yrange, dy)
            max_body_xrange = max(max_body_xrange, dx)

        return [max_torso_yrange, max_torso_xrange, max_body_yrange, max_body_xrange]

    def _determine_crop_region(self, keypoints, image_height, image_width):
        target_keypoints = {
            BodyPart(i): (
                keypoints[i, 0] * image_height,
                keypoints[i, 1] * image_width
            ) for i in range(len(BodyPart))
        }

        if self._torso_visible(keypoints):
            center_y = np.mean([
                target_keypoints[BodyPart.LEFT_HIP][0],
                target_keypoints[BodyPart.RIGHT_HIP][0]
            ])
            center_x = np.mean([
                target_keypoints[BodyPart.LEFT_HIP][1],
                target_keypoints[BodyPart.RIGHT_HIP][1]
            ])

            torso_yr, torso_xr, body_yr, body_xr = self._determine_torso_and_body_range(
                keypoints, target_keypoints, center_y, center_x
            )

            crop_length_half = min(
                np.amax([
                    torso_xr * self._TORSO_EXPANSION_RATIO,
                    torso_yr * self._TORSO_EXPANSION_RATIO,
                    body_yr * self._BODY_EXPANSION_RATIO,
                    body_xr * self._BODY_EXPANSION_RATIO
                ]),
                np.amin([center_x, image_width - center_x, center_y, image_height - center_y])
            )

            if crop_length_half > max(image_width, image_height) / 2:
                return self.init_crop_region(image_height, image_width)

            crop_corner = [center_y - crop_length_half, center_x - crop_length_half]
            crop_length = crop_length_half * 2

            return {
                'y_min': crop_corner[0] / image_height,
                'x_min': crop_corner[1] / image_width,
                'y_max': (crop_corner[0] + crop_length) / image_height,
                'x_max': (crop_corner[1] + crop_length) / image_width,
                'height': crop_length / image_height,
                'width': crop_length / image_width
            }

        return self.init_crop_region(image_height, image_width)

    def _crop_and_resize(self, image: np.ndarray, crop_region: Dict[str, float], crop_size: Tuple[int, int]) -> np.ndarray:
        h, w = image.shape[:2]
        y_min = max(0, int(crop_region['y_min'] * h))
        y_max = min(h, int(crop_region['y_max'] * h))
        x_min = max(0, int(crop_region['x_min'] * w))
        x_max = min(w, int(crop_region['x_max'] * w))

        cropped = image[y_min:y_max, x_min:x_max]
        padded = cv2.copyMakeBorder(
            cropped,
            top=int(max(0, -crop_region['y_min'] * h)),
            bottom=int(max(0, (crop_region['y_max'] - 1) * h)),
            left=int(max(0, -crop_region['x_min'] * w)),
            right=int(max(0, (crop_region['x_max'] - 1) * w)),
            borderType=cv2.BORDER_CONSTANT
        )

        resized = cv2.resize(padded, crop_size)
        resized = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        return resized.astype(np.uint8)

    def _run_detector(self, image: np.ndarray, crop_region: Dict[str, float], crop_size: Tuple[int, int]) -> np.ndarray:
        input_image = self._crop_and_resize(image, crop_region, crop_size)
        self._interpreter.set_tensor(self._input_index, np.expand_dims(input_image, axis=0))
        self._interpreter.invoke()
        keypoints = self._interpreter.get_tensor(self._output_index)
        keypoints = np.squeeze(keypoints)

        for i in range(len(BodyPart)):
            keypoints[i, 0] = crop_region['y_min'] + crop_region['height'] * keypoints[i, 0]
            keypoints[i, 1] = crop_region['x_min'] + crop_region['width'] * keypoints[i, 1]

        return keypoints

    def detect(self, input_image: np.ndarray, reset_crop_region: bool = False) -> Person:
        h, w, _ = input_image.shape
        if self._crop_region is None or reset_crop_region:
            self._crop_region = self.init_crop_region(h, w)

        keypoints = self._run_detector(input_image, self._crop_region, (self._input_height, self._input_width))
        self._crop_region = self._determine_crop_region(keypoints, h, w)

        return person_from_keypoints_with_scores(keypoints, h, w)
