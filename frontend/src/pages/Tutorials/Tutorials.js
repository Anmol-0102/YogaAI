import React from 'react';
import './Tutorials.css';
import { tutorials, fixCamera } from '../../utils/data';

export default function Tutorials() {
    return (
        <div className="tutorials-container">
            <h1 className="tutorials-heading">Basic Tutorials</h1>
            <div className="tutorials-content-container">
                {tutorials.map((tutorial, idx) => (
                    <p className="tutorials-content" key={`tutorial-${idx}`}>{tutorial}</p>
                ))}
            </div>
            <h1 className="tutorials-heading">Camera Not Working?</h1>
            <div className="tutorials-content-container">
                {fixCamera.map((point, idx) => (
                    <p className="tutorials-content" key={`fix-${idx}`}>{point}</p>
                ))}
            </div>
        </div>
    );
}
