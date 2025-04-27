import React, { useState } from 'react';
import YogaExercise from '../../components/Meditation/Intermediate/YogaExercise';
import SoundAffirmation from '../../components/Meditation/Intermediate/SoundAffirmation';
import BeejMantraChant from '../../components/Meditation/Intermediate/BeejMantraChant';
import '../../components/Meditation/Intermediate/interLanding.css';
import '../../components/Meditation/Intermediate/ChakraAnimations.css';

// Chakra images
import rootImage from '../../assets/images/chakras/c1.png';
import sacralImage from '../../assets/images/chakras/c2.png';
import solarImage from '../../assets/images/chakras/c3.png';
import heartImage from '../../assets/images/chakras/c4.png';

// Chakra audios
import rootAudio from '../../assets/audio/root-chakra.mp3';
import rootBeej from '../../assets/audio/root-bij-mantra.mp3';
import sacralAudio from '../../assets/audio/sacral-chakra.mp3';
import sacralBeej from '../../assets/audio/sacral-bij-mantra.mp3';
import solarAudio from '../../assets/audio/solar-plexus.mp3';
import solarBeej from '../../assets/audio/solar-plexus-bij-mantra.mp3';
import heartAudio from '../../assets/audio/heart-chakra.mp3';
import heartBeej from '../../assets/audio/heart-bij-mantra.mp3';

const chakraData = [
  {
    name: "Root Chakra",
    color: "#b30059",
    image: rootImage,
    mantra: "Lam",
    affirmation: "I am grounded, safe, and secure.",
    poses: ["Mountain Pose", "Warrior Pose", "Tree Pose"],
    audio: rootAudio,
    beejMantraAudio: rootBeej,
  },
  {
    name: "Sacral Chakra",
    color: "#ff7f00",
    image: sacralImage,
    mantra: "Vam",
    affirmation: "I embrace my creativity and sexuality.",
    poses: ["Seated Forward Bend", "Child’s Pose", "Cobra Pose"],
    audio: sacralAudio,
    beejMantraAudio: sacralBeej,
  },
  {
    name: "Solar Plexus Chakra",
    color: "#ffcc00",
    image: solarImage,
    mantra: "Ram",
    affirmation: "I am confident and in control of my life.",
    poses: ["Plank Pose", "Boat Pose", "Bow Pose"],
    audio: solarAudio,
    beejMantraAudio: solarBeej,
  },
  {
    name: "Heart Chakra",
    color: "#00cc66",
    image: heartImage,
    mantra: "Yam",
    affirmation: "I am open to giving and receiving love.",
    poses: ["Camel Pose", "Bridge Pose", "Cobra Pose"],
    audio: heartAudio,
    beejMantraAudio: heartBeej,
  },
];

const Intermediate = () => {
  const [selectedChakra, setSelectedChakra] = useState(null);

  const handleChakraSelect = (chakra) => {
    setSelectedChakra(chakra);
  };

  return (
    <div className="intermediate-page">
      <section className="intro-section">
        <h1>Intermediate Chakra Balancing</h1>
        <p>
          Welcome to the Intermediate Chakra Balancing session. Focus on activating your energy centers using yoga, sound, and meditation.
        </p>
      </section>

      {!selectedChakra ? (
        <section className="chakra-selection-section">
          <h2>Select a Chakra to Activate</h2>
          <div className="chakra-cards-container">
            {chakraData.map((chakra) => (
              <div
                key={chakra.name}
                className="chakra-card"
                style={{ borderColor: chakra.color }}
                onClick={() => handleChakraSelect(chakra)}
              >
                <img
                  src={chakra.image}
                  alt={`${chakra.name} chakra`}
                  className="chakra-card-image"
                />
                <h3 className="chakra-card-title" style={{ color: chakra.color }}>
                  {chakra.name}
                </h3>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="chakra-details-section">
          <div className="chakra-detail-header">
            <h2>{selectedChakra.name}</h2>
            <button className="cta-button" onClick={() => setSelectedChakra(null)}>
              Go Back
            </button>
          </div>

          <div className="chakra-content">
            <YogaExercise
              chakraName={selectedChakra.name}
              poses={selectedChakra.poses}
              image={selectedChakra.image}
              color={selectedChakra.color}
            />
            <SoundAffirmation
              mantra={selectedChakra.mantra}
              audioSrc={selectedChakra.audio}
              affirmation={selectedChakra.affirmation}
            />
            <BeejMantraChant
              mantra={selectedChakra.mantra}
              audioSrc={selectedChakra.beejMantraAudio}
            />
          </div>
        </section>
      )}

      <section className="final-message">
        <p>
          Consistent practice brings balance. Continue your chakra journey and experience profound shifts.
        </p>
        <button className="cta-button">Take a Break</button>
      </section>
    </div>
  );
};

export default Intermediate;
