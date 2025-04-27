import os
import csv
import pandas as pd
import numpy as np
import tensorflow as tf
from tqdm import tqdm

from movenet import Movenet
from bodyPart import Person  # Ensure Person class is defined correctly in bodyPart.py

body_parts = {
    'NOSE': 0, 'LEFT_EYE': 1, 'RIGHT_EYE': 2, 'LEFT_EAR': 3, 'RIGHT_EAR': 4,
    'LEFT_SHOULDER': 5, 'RIGHT_SHOULDER': 6, 'LEFT_ELBOW': 7, 'RIGHT_ELBOW': 8,
    'LEFT_WRIST': 9, 'RIGHT_WRIST': 10, 'LEFT_HIP': 11, 'RIGHT_HIP': 12,
    'LEFT_KNEE': 13, 'RIGHT_KNEE': 14, 'LEFT_ANKLE': 15, 'RIGHT_ANKLE': 16
}

class MovenetPreprocessor:
    def __init__(self, images_in_folder, images_out_folder, csvs_out_path):
        self._images_in_folder = images_in_folder
        self._images_out_folder = images_out_folder
        self._csvs_out_path = csvs_out_path
        self._csvs_out_folder_per_class = os.path.join(self._csvs_out_path, "per_class_csvs")
        os.makedirs(self._csvs_out_folder_per_class, exist_ok=True)
        self._messages = []
        self._pose_class_names = sorted([
            n for n in os.listdir(images_in_folder)
            if os.path.isdir(os.path.join(images_in_folder, n))
        ])

    def process(self, detection_threshold, model, model_input_size, output_csv_path, temp_csv_dir=None):
        all_rows = []

        for class_no, pose_class_name in enumerate(self._pose_class_names):
            images_in_folder = os.path.join(self._images_in_folder, pose_class_name)
            if temp_csv_dir:
                os.makedirs(temp_csv_dir, exist_ok=True)
                csv_out_path = os.path.join(temp_csv_dir, pose_class_name + '.csv')
            else:
                csv_out_path = None

            os.makedirs(self._images_out_folder, exist_ok=True)

            image_names = sorted([
                n for n in os.listdir(images_in_folder)
                if n.lower().endswith(('.jpg', '.jpeg', '.png'))
            ])
            class_rows = []

            for image_name in tqdm(image_names, desc=f'Processing {pose_class_name}'):
                image_path = os.path.join(images_in_folder, image_name)

                try:
                    image_data = tf.io.read_file(image_path)
                    image = tf.io.decode_image(image_data, channels=3)
                except Exception as e:
                    self._messages.append(f'Skipped {image_path} — invalid image ({e})')
                    continue

                if image.shape[-1] != 3:
                    self._messages.append(f'Skipped {image_path} — not RGB')
                    continue

                person = model.detect(image.numpy())
                if person is None or len(person.keypoints) != 17:
                    self._messages.append(f'Skipped {image_path} — no person detected')
                    continue

                min_score = min([kp.score for kp in person.keypoints])
                if min_score < detection_threshold:
                    self._messages.append(f'Skipped {image_path} — low confidence keypoints')
                    continue

                pose_landmarks = np.array([[kp.x, kp.y, kp.score] for kp in person.keypoints], dtype=np.float32)
                flat_coords = pose_landmarks.flatten().astype(str).tolist()
                row = [image_name, pose_class_name, class_no] + flat_coords
                class_rows.append(row)
                all_rows.append(row)

            if csv_out_path:
                with open(csv_out_path, 'w', newline='') as csv_out_file:
                    writer = csv.writer(csv_out_file)
                    header = ['image_name', 'class_name', 'class_no'] + [f'{i}_{coord}' for i in range(17) for coord in ['x', 'y', 'score']]
                    writer.writerow(header)
                    writer.writerows(class_rows)

        # Save skipped logs
        skipped_log_dir = os.path.dirname(output_csv_path)
        if skipped_log_dir:
            os.makedirs(skipped_log_dir, exist_ok=True)
        skipped_log_path = os.path.join(skipped_log_dir, "skipped_log.txt")
        try:
            with open(skipped_log_path, "w", encoding="utf-8") as log_file:
                for msg in self._messages:
                    log_file.write(msg + "\n")
            print(f"⚠️ Skipped image logs saved to: {skipped_log_path}")
        except Exception as e:
            print(f"❌ Could not write skipped log file: {e}")

        print("✅ Preprocessing complete.")
        for msg in self._messages:
            print("⚠️", msg)

        # Save final merged CSV
        try:
            header = ['image_name', 'class_name', 'class_no'] + [f'{i}_{coord}' for i in range(17) for coord in ['x', 'y', 'score']]
            df = pd.DataFrame(all_rows, columns=header)
            df.to_csv(output_csv_path, index=False)
            print(f"✅ Final CSV saved to {output_csv_path}")
        except Exception as e:
            print(f"❌ Could not save final CSV: {e}")

    def all_landmarks_as_dataframe(self):
        total_df = None
        for class_index, class_name in enumerate(self._pose_class_names):
            csv_out_path = os.path.join(self._csvs_out_folder_per_class, class_name + '.csv')
            if not os.path.exists(csv_out_path):
                continue

            per_class_df = pd.read_csv(csv_out_path)
            per_class_df['class_no'] = class_index
            per_class_df['class_name'] = class_name
            per_class_df['filename'] = class_name + '/' + per_class_df['image_name']

            if total_df is None:
                total_df = per_class_df
            else:
                total_df = pd.concat([total_df, per_class_df], axis=0)

        header = ['filename']
        for part in body_parts.keys():
            header.extend([f'{part}_x', f'{part}_y', f'{part}_score'])
        header += ['class_no', 'class_name']
        total_df.columns = header

        return total_df


if __name__ == '__main__':
    model = Movenet(model_path='movenet_thunder.tflite')

    # Train set
    train_preprocessor = MovenetPreprocessor(
        images_in_folder='yoga_poses/train',
        images_out_folder='preprocessed/train',
        csvs_out_path='csv_temp/train'
    )

    train_preprocessor.process(
        detection_threshold=0.1,
        model=model,
        model_input_size=(192, 192),
        output_csv_path='csv_temp/train/train_data_output.csv',
        temp_csv_dir='csv_temp/train/per_class_csvs'
    )

    # Test set
    test_preprocessor = MovenetPreprocessor(
        images_in_folder='yoga_poses/test',
        images_out_folder='preprocessed/test',
        csvs_out_path='csv_temp/test'
    )

    test_preprocessor.process(
        detection_threshold=0.1,
        model=model,
        model_input_size=(192, 192),
        output_csv_path='csv_temp/test/test_data_output.csv',
        temp_csv_dir='csv_temp/test/per_class_csvs'
    )



