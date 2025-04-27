from enum import Enum

# Enum for all 17 body keypoints
class BodyPart(Enum):
    NOSE = 0
    LEFT_EYE = 1
    RIGHT_EYE = 2
    LEFT_EAR = 3
    RIGHT_EAR = 4
    LEFT_SHOULDER = 5
    RIGHT_SHOULDER = 6
    LEFT_ELBOW = 7
    RIGHT_ELBOW = 8
    LEFT_WRIST = 9
    RIGHT_WRIST = 10
    LEFT_HIP = 11
    RIGHT_HIP = 12
    LEFT_KNEE = 13
    RIGHT_KNEE = 14
    LEFT_ANKLE = 15
    RIGHT_ANKLE = 16

# A keypoint data structure
class Keypoint:
    def __init__(self, body_part, x, y, score):
        self.body_part = body_part
        self.x = x
        self.y = y
        self.score = score

    def __repr__(self):
        return f"{self.body_part.name}: ({self.x:.1f}, {self.y:.1f}) score={self.score:.2f}"

# A person with multiple keypoints
class Person:
    def __init__(self, keypoints):
        self.keypoints = keypoints

    def __repr__(self):
        return '\n'.join([str(kp) for kp in self.keypoints])

# Convert MoveNet keypoints into a structured Person object
def person_from_keypoints_with_scores(keypoints_with_scores, height, width):
    keypoints = []
    for i in range(keypoints_with_scores.shape[0]):
        y, x, score = keypoints_with_scores[i]
        keypoints.append(
            Keypoint(BodyPart(i), x * width, y * height, score)
        )
    return Person(keypoints)
