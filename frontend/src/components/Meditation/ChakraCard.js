import React, { useRef, useState, useEffect } from 'react';

const ChakraCard = ({ name, description, audioSrc, color }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

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
    <div className="chakra-card" style={{ borderLeft: `6px solid ${color}`, padding: '16px', borderRadius: '20px', width: '400px', background: '#fff', color: '#333' }}>
      <h3 style={{ color }}>{name}</h3>
      <p>{description}</p>

      <audio ref={audioRef} loop>
        <source src={audioSrc} type="audio/mp3" />
        Chakra audio not supported.
      </audio>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleTogglePlay} className="sound-btn" style={{ marginBottom: '10px' }}>
          {isPlaying ? '⏹ Stop' : '▶️ Play'}
        </button>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ color: '#73003c' }}>
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
        </div>

        <div>
          <label style={{ color: '#73003c' }}>
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
    </div>
  );
};

export default ChakraCard;
