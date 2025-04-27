import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
from bodyPart import BodyPart

# --- Load CSV ---
def load_csv(csv_path):
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"❌ CSV file not found: {csv_path}")
    
    df = pd.read_csv(csv_path)
    required_cols = {'image_name', 'class_name', 'class_no'}
    if not required_cols.issubset(df.columns):
        raise ValueError(f"❌ CSV must contain the following columns: {required_cols}")

    class_df = df[['class_no', 'class_name']].drop_duplicates().sort_values('class_no')
    classes = class_df['class_name'].tolist()

    df.drop(columns=['image_name', 'class_name'], inplace=True)
    y = keras.utils.to_categorical(df.pop('class_no'))
    X = df.astype('float32')

    return X, y, classes

# --- Pose Normalization ---
def get_center_point(landmarks, left, right):
    left = tf.gather(landmarks, left.value, axis=1)
    right = tf.gather(landmarks, right.value, axis=1)
    return (left + right) * 0.5

def get_pose_size(landmarks, torso_multiplier=2.5):
    hips_center = get_center_point(landmarks, BodyPart.LEFT_HIP, BodyPart.RIGHT_HIP)
    shoulders_center = get_center_point(landmarks, BodyPart.LEFT_SHOULDER, BodyPart.RIGHT_SHOULDER)
    torso_size = tf.linalg.norm(shoulders_center - hips_center, axis=-1)
    pose_center = tf.expand_dims(hips_center, axis=1)
    dists = landmarks - pose_center
    max_dist = tf.reduce_max(tf.linalg.norm(dists, axis=-1))
    return tf.maximum(torso_size * torso_multiplier, max_dist)

def normalize_landmarks(landmarks):
    center = get_center_point(landmarks, BodyPart.LEFT_HIP, BodyPart.RIGHT_HIP)
    center = tf.expand_dims(center, axis=1)
    landmarks -= center
    pose_size = get_pose_size(landmarks)
    pose_size = tf.expand_dims(tf.expand_dims(pose_size, axis=-1), axis=-1)
    landmarks /= pose_size
    return landmarks

def landmarks_to_embedding(landmarks):
    landmarks = tf.reshape(landmarks, (-1, 17, 3))[:, :, :2]
    landmarks = normalize_landmarks(landmarks)
    return tf.reshape(landmarks, (-1, 34))

def preprocess(X):
    landmarks = tf.convert_to_tensor(X.values, dtype=tf.float32)
    return landmarks_to_embedding(landmarks)

# --- Load Data ---
print("📥 Loading test and train CSVs...")
X_test_raw, y_test, _ = load_csv("csv_temp/test/test_data_output.csv")
X_train_raw, y_train, _ = load_csv("csv_temp/train/train_data_output.csv")

# --- Preprocess ---
print("🧼 Preprocessing landmarks...")
X_test = preprocess(X_test_raw)
X_train = preprocess(X_train_raw)

# --- Load Model ---
print("📦 Loading saved model...")
model = keras.models.load_model("yoga_model.h5")

# 🔍 Evaluate on Test Set
print("\n📊 Evaluation on Test Set...")
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"✅ TEST LOSS: {test_loss:.4f}")
print(f"✅ TEST ACCURACY: {test_accuracy:.4f}")

# 🔍 Evaluate on Train Set
print("\n📊 Evaluation on Train Set...")
train_loss, train_accuracy = model.evaluate(X_train, y_train)
print(f"✅ TRAIN LOSS: {train_loss:.4f}")
print(f"✅ TRAIN ACCURACY: {train_accuracy:.4f}")

# 🔮 Predictions
print("\n🔮 Generating predictions...")
y_pred_probs = model.predict(X_test)
y_pred_labels = np.argmax(y_pred_probs, axis=1)
y_true_labels = np.argmax(y_test, axis=1)

# 🧠 Load class names
print("\n🔤 Loading label encoder classes...")
with open("label_encoder_classes.npy", "rb") as f:
    class_names = np.load(f)

# 📌 Ensure labels match actual prediction and true sets
unique_labels = sorted(set(y_true_labels) | set(y_pred_labels))
used_class_names = [class_names[i] for i in unique_labels]

# 🧾 Classification Report
try:
    print("\n📄 Classification Report:\n")
    report = classification_report(
        y_true_labels,
        y_pred_labels,
        labels=unique_labels,
        target_names=used_class_names,
        zero_division=0
    )
    print(report)
    with open("evaluation_report.txt", "w") as f:
        f.write(report)
except ValueError as e:
    print("⚠️ Could not generate classification report:", e)

# 📊 Confusion Matrix
try:
    print("\n📊 Plotting Confusion Matrix...")
    cm = confusion_matrix(y_true_labels, y_pred_labels, labels=unique_labels)
    plt.figure(figsize=(10, 7))
    sns.heatmap(
        cm,
        annot=True,
        fmt='d',
        cmap="Blues",
        xticklabels=used_class_names,
        yticklabels=used_class_names
    )
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig("confusion_matrix_eval.png")
    plt.show()
except Exception as e:
    print("⚠️ Could not plot confusion matrix:", e)
