import React, { useState, useEffect } from 'react';
import BreathingExercise from '../../components/Meditation/BreathingExercise';
import MeditationAudio from '../../components/Meditation/MeditationAudio';
import ChakraCard from '../../components/Meditation/ChakraCard';
import AsanaCard from '../../components/Meditation/AsanaCard';
import './Beginner.css';

// Asana Images
import sukhasana from '../../assets/images/sukhasana.png';
import balasana from '../../assets/images/balasana.png';
import tadasana from '../../assets/images/tadasana.png';

// 🎧 Local Audio Imports
import birdsMorning from '../../assets/audio/birds-morning.mp3';
import birdsForest from '../../assets/audio/birds-deepforest.mp3';
import omChant from '../../assets/audio/om-chant.mp3';
import lightRain from '../../assets/audio/light-rain.mp3';
import muladhar from '../../assets/audio/muladara.mp3';

export default function Beginner() {
  const [selectedSound, setSelectedSound] = useState('birds1');

  // Correct audio paths using imports
  const soothingSounds = {
    birds1: birdsMorning,
    birds2: birdsForest,
    om: omChant,
    rain: lightRain,
    muladhar: muladhar,
  };

  const yogaAsanas = [
    {
      title: 'Sukhasana (Easy Pose)',
      image: sukhasana,
      duration: '2',
      instructions: 'Sit cross-legged, spine straight, hands on knees. Focus on breath.',
      audioSrc: birdsMorning,
    },
    {
      title: 'Balasana (Child’s Pose)',
      image: balasana,
      duration: '1',
      instructions: 'Kneel, stretch arms forward and rest forehead. Breathe deeply.',
      audioSrc: birdsForest,
    },
    {
      title: 'Tadasana (Mountain Pose)',
      image: tadasana,
      duration: '2',
      instructions: 'Stand tall, feet together, hands overhead. Inhale deeply.',
      audioSrc: omChant,
    },
  ];

  return (
    <div className="beginner-container">
      <h1 className="beginner-heading">🧘 Beginner Meditation</h1>
      <p className="beginner-intro">
        Begin your journey with breathing, sound, and movement to balance mind and body.
      </p>

      <div className="breathing-audio-wrapper">
        <section className="breathing-section">
          <h2>🌬️ 4-7-8 Breathing Technique</h2>
          <BreathingExercise inhale={4} hold={7} exhale={8} />
        </section>

        <section className="soothing-sound-section">
          <h2>🎶 Soothing Background Sounds</h2>
          <div className="sound-buttons">
            {Object.keys(soothingSounds).map((key) => (
              <button
                key={key}
                className={`sound-btn ${selectedSound === key ? 'active' : ''}`}
                onClick={() => setSelectedSound(key)}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 🔊 Single Audio Player */}
          <MeditationAudio audioSrc={soothingSounds[selectedSound]} />
        </section>
      </div>

      {/* Chakra Section */}
      <section className="chakra-audio-section">
        <h2>🔴 Muladhara (Root Chakra)</h2>
        <ChakraCard
          name="Muladhara Chakra"
          audioSrc={soothingSounds.muladhar}
          color="#ff1a1a"
          description="Feel grounded and stable. Listen in a comfortable seated posture like Sukhasana."
        />
      </section>

      {/* Asana Section */}
      <section className="asana-section">
        <h2>🧘‍♂️ Recommended Yoga Asanas</h2>
        <div className="asana-grid">
          {yogaAsanas.map((asana, index) => (
            <AsanaCard key={index} {...asana} />
          ))}
        </div>
      </section>
    </div>
  );
}
