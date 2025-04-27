import React, { useEffect, useRef, useState } from 'react';

const MeditationAudio = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7); // Default volume
  const [playbackRate, setPlaybackRate] = useState(1); // Normal speed

  // Handle audio changes on audioSrc change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;

      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [audioSrc]);

  // Handle volume or speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  // Toggle play/pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-wrapper">
      <audio ref={audioRef} loop>
        <source src={audioSrc} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <button onClick={handleTogglePlay} className="sound-btn">
          {isPlaying ? '⏹ Stop Sound' : '▶️ Play Sound'}
        </button>

        {/* Volume Control */}
        <label style={{ color: '#fff' }}>
          🔊 Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>

        {/* Playback Speed */}
        <label style={{ color: '#fff' }}>
          ⏩ Speed:
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', padding: '4px' }}
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default MeditationAudio;
