import React from 'react';
import { poseInstructions } from '../../utils/data/index.js';
import { poseImages } from '../../assets/pose_images';
import './Instructions.css';

export default function Instructions({ currentPose }) {
    return (
        <div className="instructions-container">
            <ul className="instructions-list">
                {poseInstructions[currentPose]?.map((instruction, index) => (
                    <li className="instruction" key={index}>
                        {instruction}
                    </li>
                ))}
            </ul>
            {poseImages[currentPose] && (
                <img 
                    className="pose-demo-img"
                    src={poseImages[currentPose]} 
                    alt={`${currentPose} demonstration`} 
                />
            )}
        </div>
    );
}
