import React, { useState, useEffect } from 'react';
import './BreathingExercise.css';

const breathingPatterns = {
  '4-7-8': [4, 7, 8],
  'Box': [4, 4, 4, 4],
};

export default function BreathingExercise() {
  const [pattern, setPattern] = useState('4-7-8');
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  const labels = {
    '4-7-8': ['Inhale', 'Hold', 'Exhale'],
    'Box': ['Inhale', 'Hold', 'Exhale', 'Hold'],
  };

  const nextStep = () => {
    const steps = breathingPatterns[pattern];
    setStep((prev) => (prev + 1) % steps.length);
    setCount(steps[(step + 1) % steps.length]);
  };

  const startExercise = () => {
    setStep(0);
    setCount(breathingPatterns[pattern][0]);
    setRunning(true);
  };

  const stopExercise = () => {
    setRunning(false);
    setCount(0);
    setStep(0);
  };

  useEffect(() => {
    let timer;
    if (running && count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else if (running && count === 0) {
      nextStep();
    }
    return () => clearTimeout(timer);
  }, [count, running, nextStep]);


  return (
    <div className="breathing-container">
      <h2 className="breathing-title">Breathing Techniques</h2>

      <div className="pattern-selector">
        <label>Select Pattern:</label>
        <select onChange={(e) => setPattern(e.target.value)} value={pattern}>
          <option value="4-7-8">4-7-8 Breathing</option>
          <option value="Box">Box Breathing</option>
        </select>
      </div>

      <div className="breathing-box">
        {running ? (
          <>
            <h3 className="step-label">{labels[pattern][step]}</h3>
            <div className="count-circle">{count}s</div>
          </>
        ) : (
          <p>Click start to begin your breath cycle</p>
        )}
      </div>

      <div className="btn-group">
        <button onClick={startExercise} className="btn breath-start">Start</button>
        <button onClick={stopExercise} className="btn breath-stop">Stop</button>
      </div>
    </div>
  );
}
