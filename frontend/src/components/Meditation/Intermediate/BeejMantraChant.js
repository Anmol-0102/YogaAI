import React, { useRef, useState, useEffect } from 'react';
import './Intermediate.css';

const BeejMantraChant = ({ mantra, audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loop, setLoop] = useState(true);
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    let timer = null;

    if (isPlaying && sessionTime > 0 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = loop;
    }
  }, [volume, playbackRate, loop]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (sessionTime > 0 && timeLeft === 0) {
        setTimeLeft(sessionTime);
        setSessionComplete(false);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSessionSelect = (minutes) => {
    setSessionTime(minutes * 60);
    setTimeLeft(minutes * 60);
    setSessionComplete(false);
  };

  const handleSessionEnd = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setSessionComplete(true);
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = sessionTime > 0 ? ((sessionTime - timeLeft) / sessionTime) * 100 : 0;

  return (
    <div className="beej-mantra-container">
      <h3>🕉️ Beej Mantra Chant for Chakra Activation</h3>
      <p className="mantra-text">{mantra}</p>

      <audio ref={audioRef} src={audioSrc} preload="auto" />

      <div className="session-buttons">
        {[5, 10, 20, 30].map((min) => (
          <button
            key={min}
            className={`timer-btn ${sessionTime === min * 60 ? 'active' : ''}`}
            onClick={() => handleSessionSelect(min)}
          >
            {min} min
          </button>
        ))}
      </div>

      <div className="audio-controls">
        <button onClick={handlePlayPause} className="play-btn">
          {isPlaying ? '⏸ Pause' : '▶️ Play'}
        </button>

        <button onClick={() => setLoop(!loop)} className={`loop-btn ${loop ? 'active' : ''}`}>
          🔁 {loop ? 'Looping' : 'No Loop'}
        </button>

        <div className="volume-control">
          <label>🔊 Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>

        <div className="speed-control">
          <label>⏩ Speed</label>
          <select value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>

      {sessionTime > 0 && (
        <div className="progress-timer">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="timer-text">{formatTime(timeLeft)} remaining</div>
        </div>
      )}

      {sessionComplete && (
        <div className="session-complete-message">
          ✨ Session Complete. Namaste 🙏
        </div>
      )}
    </div>
  );
};

export default BeejMantraChant;
