import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import c1 from '../../assets/images/chakras/c1.png';
import c2 from '../../assets/images/chakras/c2.png';
import c3 from '../../assets/images/chakras/c3.png';
import c4 from '../../assets/images/chakras/c4.png';
import c5 from '../../assets/images/chakras/c5.png';
import c6 from '../../assets/images/chakras/c6.png';
import c7 from '../../assets/images/chakras/c7.png';

import auraCircle from '../../assets/images/aura_circle.png';
import cornerPose from '../../assets/images/yoga_corner_pose.png';

export default function Home() {
  const chakraImages = [c1, c2, c3, c4, c5, c6, c7];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-heading">योगAI</h1>
        <div className="nav-buttons">
          <Link to="/meditation">
            <button className="btn" id="meditation-btn">Meditation</button>
          </Link>
          <Link to="/about">
            <button className="btn" id="about-btn">About</button>
          </Link>
          
        </div>
      </header>

      <main className="home-main">
        <div className="aura-wrapper">
          <img src={auraCircle} alt="Aura Circle" className="aura-circle" />

          <div className="chakra-rotation-wrapper">
            <div className="chakra-circle">
              {chakraImages.map((src, i) => {
                const angle = i * (360 / chakraImages.length); // Equal spacing
                const radius = 240; // Distance from center
                const center = 300; // Center of 600x600 box
                const x = center + radius * Math.cos((angle * Math.PI) / 180);
                const y = center + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`chakra-${i + 1}`}
                    className="chakra-img"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: `translate(-50%, -50%) rotate(0deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="center-content">
            <h1 className="description">A योग AI Trainer</h1>
            <div className="btn-section">
              <Link to="/start"><button className="btn start-btn">Let's Start</button></Link>
              <Link to="/tutorials"><button className="btn start-btn">Tutorials</button></Link>
            </div>
          </div>
        </div>

        <img src={cornerPose} alt="Yoga Pose" className="corner-pose" />
      </main>
    </div>
  );
}
