import React, { useState } from 'react';
import chakraData from './ChakraData';
import './Intermediate.css';

const YogaExercise = ({ poses, onNext }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [timer, setTimer] = useState(30);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startPose = (index) => {
    clearInterval(intervalId);
    setActiveIndex(index);
    setTimer(30);
    setRunning(true);
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(id);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const skip = () => {
    clearInterval(intervalId);
    setRunning(false);
    setTimer(0);
  };

  return (
    <div className="yoga-exercise-container">
      <h3>🧘 Yoga Poses for Chakra Activation</h3>

      <div className="pose-card-scroll">
        {poses.map((pose, index) => (
          <div key={index} className="pose-card">
            <img src={pose.image} alt={pose.name} className="pose-image" />
            <h4>{pose.name}</h4>
            {activeIndex === index && running ? (
              <>
                <div className="pose-timer">{timer}s</div>
                <div className="pose-controls">
                  <button onClick={skip} className="skip-btn">Skip</button>
                </div>
              </>
            ) : (
              <button onClick={() => startPose(index)} className="start-btn">Start Pose</button>
            )}
          </div>
        ))}
      </div>

      <button className="next-button" onClick={onNext}>
        Next: Sound Affirmation
      </button>
    </div>
  );
};

export default YogaExercise;
