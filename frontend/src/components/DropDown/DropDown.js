import React from 'react';
import { poseImages } from '../../assets/pose_images';
import './DropDown.css';

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
    return (
        <div className='dropdown dropdown-container'>
            <button 
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                id="pose-dropdown-btn"
                aria-expanded="false"
                aria-haspopup="true"
                aria-controls="pose-dropdown-menu"
            >
                {currentPose}
            </button>
            <ul 
                className="dropdown-menu dropdown-custom-menu" 
                id="pose-dropdown-menu"
                aria-labelledby="pose-dropdown-btn"
            >
                {poseList.map((pose, index) => (
                    <li key={index} onClick={() => setCurrentPose(pose)}>
                        <div className="dropdown-item-container">
                            <p className="dropdown-item-1">{pose}</p>
                            <img 
                                src={poseImages[pose]} 
                                className="dropdown-img" 
                                alt={`${pose} thumbnail`} 
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
