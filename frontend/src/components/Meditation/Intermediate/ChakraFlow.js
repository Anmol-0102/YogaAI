import React, { useState } from 'react';
import YogaExercise from './YogaExercise';
import SoundAffirmation from './SoundAffirmation';
import BeejMantraChant from './BeejMantraChant';
import './Intermediate.css';

const ChakraFlow = ({ chakra, onBack }) => {
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleNext = () => {
    setCompletedSteps(prev => [...new Set([...prev, step])]);
    setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep(prevStep => prevStep - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <YogaExercise
            poses={chakra.yogaPoses}
            image={chakra.image}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <SoundAffirmation
            audioSrc={chakra.affirmationAudio}
            chakraColor={chakra.color}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <BeejMantraChant
            mantra={chakra.mantra}
            audioSrc={chakra.mantraAudio}
            chakraColor={chakra.color}
            onFinish={() => console.log('Chant session complete!')}
          />
        );
      default:
        return <p>All steps completed. Namaste 🙏</p>;
    }
  };

  return (
    <div className="chakra-flow-container">
      <div className="chakra-header">
        <button className="back-button" onClick={handleBack}>
          {step === 1 ? 'Back to Chakras' : '← Previous'}
        </button>
        <h2 className="chakra-title">{chakra.name}</h2>
        <div className="chakra-progress">
          <span className={step >= 1 ? 'active' : ''}>🧘 Yoga</span>
          <span className={step >= 2 ? 'active' : ''}>🎧 Affirmation</span>
          <span className={step >= 3 ? 'active' : ''}>🔊 Mantra</span>
        </div>
      </div>

      <div className="chakra-step-body">
        {renderStep()}
      </div>
    </div>
  );
};

export default ChakraFlow;
