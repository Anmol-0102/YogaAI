import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-heading">About This Project</h1>
      <div className="about-main">
        <p className="about-content">
          <strong>“Where ancient Yog meets modern Tech.”</strong>  
          This project is a unique blend of traditional wellness practices and cutting-edge artificial intelligence. 
          Our real-time Yoga Trainer guides you with precision as you practice various āsanas, ensuring your form is just right.
        </p>

        <p className="about-content">
          Using TensorFlow's powerful <strong>MoveNet</strong> model, the system detects your body’s keypoints — 
          shoulders, hips, knees, and more — and classifies the pose using a trained neural network. 
          The backend AI is crafted in Python and smoothly runs in your browser using TensorFlow.js. 
          No heavy downloads. No expensive gear. Just <em>Yoga with Intelligence</em> — anytime, anywhere.
        </p>

        <p className="about-content">
          This isn’t just for techies. It’s for anyone who wants to combine <strong>swasthya (health)</strong> with <strong>smartness</strong>. 
          Whether you're practicing <em>Vrikshasana</em> or exploring <em>Bhujangasana</em>, our AI provides real-time feedback, helping you grow on your wellness journey.
        </p>

        <p className="about-content">
          <strong>🧘 New! Meditation Module:</strong>  
          We’ve recently introduced a guided meditation experience — a calm, immersive journey to help you find stillness, reduce stress, and improve mental clarity.
          With real-time audio guidance and relaxing visuals, it’s a perfect way to end your yoga session.  
          <strong>“Man ko shānti mile, aur tan ko urjā.”</strong>
        </p>

        <p className="about-content">
          As an open-source initiative, our goal is to empower both developers and wellness seekers. Learn how AI sees the human body, build on it, or just sit back and breathe deeper.
        </p>

        <div className="developer-info">
          <h4>Get in Touch</h4>
          <p className="about-content">
            Stay connected and be part of the journey:
          </p>
          <p className="about-content">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
          <p className="about-content">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </p>
          <p className="about-content">
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
