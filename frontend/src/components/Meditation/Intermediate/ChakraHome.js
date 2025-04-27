import React, { useState } from 'react';
import chakraData from './ChakraData';
import ChakraFlow from './ChakraFlow';
import './Intermediate.css';

const ChakraHome = () => {
  const [selectedChakra, setSelectedChakra] = useState(null);

  const handleCardClick = (chakra) => {
    setSelectedChakra(chakra);
  };

  const handleBack = () => {
    setSelectedChakra(null);
  };

  return (
    <div className="chakra-home-container">
      {!selectedChakra ? (
        <>
          <h2 className="chakra-heading">🌀 Chakra Activation Modules</h2>
          <p className="chakra-subtext">Click on a chakra to begin your guided practice</p>

          <div className="chakra-grid">
            {chakraData.map((chakra) => (
              <div
                key={chakra.id}
                className="chakra-card"
                style={{ borderColor: chakra.color }}
                onClick={() => handleCardClick(chakra)}
              >
                <img
                  src={chakra.image}
                  alt={chakra.name}
                  className="chakra-img"
                  loading="lazy"
                />
                <h3 style={{ color: chakra.color }}>{chakra.name}</h3>
                <p className="chakra-tip">{chakra.tips}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ChakraFlow chakra={selectedChakra} onBack={handleBack} />
      )}
    </div>
  );
};

export default ChakraHome;
