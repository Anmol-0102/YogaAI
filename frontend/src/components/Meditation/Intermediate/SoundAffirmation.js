import React, { useRef, useState, useEffect } from 'react';
import './Intermediate.css';

const SoundAffirmation = ({ audioSrc, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(5); // in minutes
  const [timerId, setTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  // Update loop setting on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      clearInterval(timerId);
    } else {
      audio.play();
      const id = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(id);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    clearInterval(timerId);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleDurationSelect = (min) => {
    setDuration(min);
    setTimeLeft(min * 60);
    handleStop();
  };

  return (
    <div className="sound-affirmation-container">
      <div className="audio-card">
        <h3>🎶 Chakra Sound Affirmation</h3>
        <p>Listen to this affirmation to align and activate your selected chakra.</p>

        <audio ref={audioRef} src={audioSrc} preload="auto" />

        <div className="audio-controls">
          <button onClick={handlePlayPause} className="play-btn">
            {isPlaying ? "⏸ Pause" : "▶️ Play"}
          </button>

          <button onClick={() => setLoop(!loop)} className={`loop-btn ${loop ? 'active' : ''}`}>
            🔁 {loop ? 'Loop On' : 'Loop Off'}
          </button>

          <div className="volume-control">
            <label htmlFor="volume-slider">🔊</label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>

        <div className="timer-controls">
          <p>🕒 Practice Duration:</p>
          {[5, 10, 20, 30].map((min) => (
            <button
              key={min}
              className={`timer-btn ${duration === min ? 'selected' : ''}`}
              onClick={() => handleDurationSelect(min)}
            >
              {min} min
            </button>
          ))}
        </div>

        {isPlaying && (
          <div className="countdown-display">
            ⏳ Time Remaining: <strong>{formatTime(timeLeft)}</strong>
          </div>
        )}

        <button className="next-button" onClick={onNext}>
          Next: Beej Mantra Chant
        </button>
      </div>
    </div>
  );
};

export default SoundAffirmation;
