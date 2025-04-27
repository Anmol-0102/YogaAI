import React from 'react';
import './PoseStart.css';

export default function PoseStart() {
    return (
        <div className="pose-start-container">
            <h2 className="pose-start-title">Ready to Begin?</h2>
            <p className="pose-start-text">Make sure your camera is on and step into the frame.</p>
            <button className="pose-start-btn">Start Pose</button>
        </div>
    );
}
