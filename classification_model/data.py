import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

def load_pose_landmarks(csv_path):
    """
    Loads the CSV containing pose keypoints and labels.

    Args:
        csv_path (str): Path to the CSV file.

    Returns:
        X: Features (pose keypoints)
        y: Labels (class numbers)
        class_names: Sorted list of class names
    """
    df = pd.read_csv(csv_path)

    # Shuffle dataframe
    df = df.sample(frac=1).reset_index(drop=True)

    # Drop filename and class_name columns
    X = df.drop(columns=['filename', 'class_name', 'class_no']).astype('float32')
    y = df['class_no'].astype('int32')

    # Sort class names alphabetically for consistency
    class_names = sorted(df['class_name'].unique().tolist())
    return X, y, class_names


def prepare_datasets(csv_path, test_size=0.15, val_size=0.15):
    """
    Loads and splits the dataset into training, validation, and test sets.

    Args:
        csv_path (str): Path to the full CSV file.
        test_size (float): Fraction of data to reserve for testing.
        val_size (float): Fraction of data to reserve for validation.

    Returns:
        Tuple of NumPy arrays: (X_train, y_train), (X_val, y_val), (X_test, y_test), class_names
    """
    X, y, class_names = load_pose_landmarks(csv_path)

    # First split: train+val vs test
    X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=test_size, stratify=y, random_state=42)

    # Second split: train vs val
    val_fraction = val_size / (1.0 - test_size)
    X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=val_fraction, stratify=y_temp, random_state=42)

    return (X_train.values, y_train.values), (X_val.values, y_val.values), (X_test.values, y_test.values), class_names
