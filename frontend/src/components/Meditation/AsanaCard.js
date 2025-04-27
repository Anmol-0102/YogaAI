import React, { useState, useEffect } from 'react';
import './AsanaCard.css';

const AsanaCard = ({ title, image, duration, instructions }) => {
  const [countdown, setCountdown] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const startTimer = () => {
    setCountdown(parseInt(duration) * 60); // in seconds
    setIsActive(true);
  };

  useEffect(() => {
    let interval = null;

    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [countdown, isActive]);

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="asana-card" onClick={isActive ? null : startTimer}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{instructions}</p>
      {isActive && (
        <div className="asana-timer">
          ⏳ {formatTime(countdown)}
        </div>
      )}
    </div>
  );
};

export default AsanaCard;
