// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import Yoga from './pages/Yoga/Yoga';
import About from './pages/About/About';
import Tutorials from './pages/Tutorials/Tutorials';
import MeditationHome from "./pages/Meditation/MeditationHome";
import Beginner from "./pages/Meditation/Beginner";
import Intermediate from "./pages/Meditation/Intermediate";
import Advanced from "./pages/Meditation/Advanced";

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Yoga />} />
        <Route path="/about" element={<About />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/meditation" element={<MeditationHome />} />
        <Route path="/meditation/beginner" element={<Beginner />} />
        <Route path="/meditation/intermediate" element={<Intermediate />} />
        <Route path="/meditation/advanced" element={<Advanced />} />
      </Routes>
    </Router>
  );
}
