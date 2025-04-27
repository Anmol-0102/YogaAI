// Yoga.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import Instructions from '../../components/Instructions/Instructions';
import DropDown from '../../components/DropDown/DropDown';

import { count } from '../../assets/audio';
import { poseImages } from '../../assets/pose_images';
import { POINTS, keypointConnections } from '../../utils/data/index';
import { drawPoint, drawSegment } from '../../utils/helper/index';

import './Yoga.css';

const poseList = ['Tree', 'Chair', 'Cobra', 'Warrior', 'Dog', 'Shoulderstand', 'Traingle'];
const CLASS_NO = {
  Chair: 0,
  Cobra: 1,
  Dog: 2,
  No_Pose: 3,
  Shoulderstand: 4,
  Triangle: 5,
  Tree: 6,
  Warrior: 7,
};

let interval = null;
let poseStarted = false;
let skeletonColor = 'white';

const getCenterPoint = (landmarks, leftIdx, rightIdx) => {
  const left = tf.gather(landmarks, leftIdx, 1);
  const right = tf.gather(landmarks, rightIdx, 1);
  return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
};

const getPoseSize = (landmarks, multiplier = 2.5) => {
  const hips = getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
  const shoulders = getCenterPoint(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
  const torsoSize = tf.norm(tf.sub(shoulders, hips));
  let center = tf.expandDims(hips, 1);
  center = tf.broadcastTo(center, [1, 17, 2]);
  const dist = tf.sub(landmarks, center);
  const maxDist = tf.max(tf.norm(dist, 'euclidean', 0));
  return tf.maximum(tf.mul(torsoSize, multiplier), maxDist);
};

const normalizeLandmarks = (landmarks) => {
  let center = getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
  center = tf.expandDims(center, 1);
  center = tf.broadcastTo(center, [1, 17, 2]);
  landmarks = tf.sub(landmarks, center);
  const size = getPoseSize(landmarks);
  return tf.div(landmarks, size);
};

const landmarksToEmbedding = (landmarks) => {
  const normalized = normalizeLandmarks(tf.expandDims(landmarks, 0));
  return tf.reshape(normalized, [1, 34]);
};

function Yoga() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState('Tree');
  const [isStartPose, setIsStartPose] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(null);
  const [accuracySum, setAccuracySum] = useState(0);
  const [accuracyCount, setAccuracyCount] = useState(0);
  const [videoStream, setVideoStream] = useState(null);

  const updateTime = useCallback(() => {
    const timeDiff = (Date.now() - startingTime) / 1000;
    setPoseTime(timeDiff);
    if (timeDiff > bestPerform) setBestPerform(timeDiff);
  }, [startingTime, bestPerform]);

  useEffect(() => {
    let timer = null;
    if (poseStarted) {
      timer = setInterval(() => setCurrentTime(Date.now()), 100);
    }
    return () => clearInterval(timer);
  }, [updateTime]);

  useEffect(() => {
    if (poseStarted) updateTime();
  }, [currentTime, updateTime]);

  const detectPose = useCallback(async (detector, classifier, audio) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== 4) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const poses = await detector.estimatePoses(video);
      if (!poses.length) return;

      const keypoints = poses[0].keypoints;
      const input = keypoints.map((kpt) => [kpt.x, kpt.y]);
      let notDetected = 0;

      keypoints.forEach((kpt) => {
        if (kpt.score > 0.4 && !['left_eye', 'right_eye'].includes(kpt.name)) {
          drawPoint(ctx, kpt.x, kpt.y, 6, 'white');
          (keypointConnections[kpt.name] || []).forEach((conn) => {
            const target = keypoints[POINTS[conn.toUpperCase()]];
            drawSegment(ctx, [kpt.x, kpt.y], [target.x, target.y], skeletonColor);
          });
        } else {
          notDetected++;
        }
      });

      if (notDetected > 4) {
        poseStarted = false;
        skeletonColor = 'white';
        setCurrentAccuracy(0);
        return;
      }

      const processed = landmarksToEmbedding(input);
      const prediction = await classifier.predict(processed).array();
      const confidence = prediction[0][CLASS_NO[currentPose]];
      const accuracy = confidence * 100;

      setCurrentAccuracy(accuracy.toFixed(1));
      setAccuracySum(prev => prev + accuracy);
      setAccuracyCount(prev => prev + 1);

      if (confidence > 0.97) {
        if (!poseStarted) {
          setStartingTime(Date.now());
          audio.play();
          poseStarted = true;
        }
        setCurrentTime(Date.now());
        skeletonColor = 'rgb(0,255,0)';
      } else {
        poseStarted = false;
        audio.pause();
        audio.currentTime = 0;
        skeletonColor = 'white';
      }
    } catch (error) {
      console.error('[DETECT ERROR]', error);
    }
  }, [currentPose]);

  const stopPose = useCallback(() => {
    setIsStartPose(false);
    clearInterval(interval);
    poseStarted = false;
    skeletonColor = 'white';

    const avgAccuracy = accuracyCount > 0 ? (accuracySum / accuracyCount).toFixed(1) : 0;
    setFinalAccuracy(avgAccuracy);

    setCurrentAccuracy(0);
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  }, [videoStream, accuracySum, accuracyCount]);

  const startYoga = useCallback(async () => {
    setIsStartPose(true);
    setFinalAccuracy(null);
    setAccuracySum(0);
    setAccuracyCount(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 800, height: 600, facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setVideoStream(stream);
      }

      await tf.setBackend('webgl');
      await tf.ready();

      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.SINGLEPOSE_THUNDER,
      });

      const classifier = await tf.loadLayersModel(
        'https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json'
      );

      const countAudio = new Audio(count);
      countAudio.loop = true;

      interval = setInterval(() => {
        detectPose(detector, classifier, countAudio);
      }, 200);
    } catch (err) {
      console.error('[START ERROR]', err);
    }
  }, [detectPose]);

  useEffect(() => {
    return () => {
      clearInterval(interval);
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  return (
    <div className="yoga-container">
      {isStartPose ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="800"
            height="600"
            style={{
              position: 'absolute',
              left: 100,
              top: 80,
              zIndex: 1,
              borderRadius: 10,
              transform: 'scaleX(-1)',
              backgroundColor: '#000',
              objectFit: 'cover',
            }}
          />

          <canvas
            ref={canvasRef}
            width="800"
            height="600"
            style={{
              position: 'absolute',
              left: 100,
              top: 80,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // center it at the top
              gap: '20px',
              marginBottom: '10px',
              zIndex: 3,
              position: 'relative',
            }}
          >
            <button onClick={stopPose} className="secondary-btn">Stop Pose</button>

            {finalAccuracy !== null && (
              <h4 style={{ margin: 0, color: '#000' }}>
                Final Accuracy: <strong>{finalAccuracy}%</strong>
              </h4>
            )}
          </div>
          <img
            src={poseImages[currentPose]}
            alt={currentPose}
            className="pose-img"
          />
          <div className="pose-details-container">
            <div className="pose-performance"><h4>Pose Time: {poseTime.toFixed(1)} s</h4></div>
            <div className="pose-performance"><h4>Best: {bestPerform.toFixed(1)} s</h4></div>
            <div className="pose-performance">
              <h4>Accuracy: {currentAccuracy}%</h4>
              <div className="accuracy-bar">
                <div
                  className="accuracy-fill"
                  style={{
                    width: `${currentAccuracy}%`,
                    background: currentAccuracy > 90 ? 'limegreen' : currentAccuracy > 70 ? 'orange' : 'red',
                    height: '8px',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <DropDown
            poseList={poseList}
            currentPose={currentPose}
            setCurrentPose={setCurrentPose}
          />
          <Instructions currentPose={currentPose} />
          <button onClick={startYoga} className="secondary-btn">Start Pose</button>
        </>
      )}
    </div>
  );
}

export default Yoga;
