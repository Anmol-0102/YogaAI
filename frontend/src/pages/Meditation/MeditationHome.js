import React from 'react';
import { Link } from 'react-router-dom';
import './Meditation.css';


import c1 from '../../assets/images/chakras/c1.png';
import c2 from '../../assets/images/chakras/c2.png';
import c3 from '../../assets/images/chakras/c3.png';
import c4 from '../../assets/images/chakras/c4.png';
import c5 from '../../assets/images/chakras/c5.png';
import c6 from '../../assets/images/chakras/c6.png';
import c7 from '../../assets/images/chakras/c7.png';

export default function MeditationHome() {
  const chakraImages = [c1, c2, c3, c4, c5, c6, c7];
  const chakraNames = [
    'Root (Muladhara) - मूलाधार',
    'Sacral (Svadhisthana) - स्वाधिष्ठान',
    'Solar Plexus (Manipura) - मणिपूर',
    'Heart (Anahata) - अनाहत',
    'Throat (Vishuddha) - विशुद्ध',
    'Third Eye (Ajna) - आज्ञा',
    'Crown (Sahasrara) - सहस्रार',
  ];

  return (
    <div className="meditation-container">
      <h1 className="meditation-title">Meditation & Chakra Balancing</h1>
      <p className="meditation-subtitle">
        Explore the subtle energy centers of your body through chakra-focused meditation and yoga.<br />
        Start with the basics, balance your inner self, and reach deeper states of consciousness.
      </p>

      {/* Level Cards */}
      <div className="level-section">
        <Link to="/meditation/beginner" className="level-card">
          <h2>Beginner</h2>
          <p>Simple breathing and mindfulness practices to get started with meditation</p>
        </Link>
        <Link to="/meditation/intermediate" className="level-card">
          <h2>Intermediate</h2>
          <p>Chakra-balancing techniques using meditation and yoga poses</p>
        </Link>
        <Link to="/meditation/advanced" className="level-card">
          <h2>Advanced</h2>
          <p>Deep chakra healing and sound-based meditation experiences</p>
        </Link>
      </div>

      {/* Chakra Visualization */}
      <div className="chakra-section">
        <h2 className="chakra-title">Explore Your Chakras</h2>
        <div className="chakra-wheel">
          {chakraImages.map((img, index) => (
            <div
              className="chakra-circle-item"
              key={index}
              onClick={() => alert(`You clicked on ${chakraNames[index]}`)}
            >
              <img src={img} alt={`chakra-${index + 1}`} />
              <span>{chakraNames[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
