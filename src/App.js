import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import AIInteraction from './components/AIInteraction';
import SoundPractice from './components/SoundPractice';
import MicrophonePage from './components/MicrophonePage';
import PracticeExercise from './components/PracticeExercise';
import ExercisesPage from './components/ExercisesPage';
import Contact from './components/Contact';
import ProgressTracking from './components/ProgressTracking';
import About from './components/About'; // Keep this import only

const Practice = () => (
  <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
    <AIInteraction />
    <div className="mt-6">
      <SoundPractice />
    </div>
  </div>
);

const Progress = () => (
  <div className="text-center p-6">
    <h2 className="text-2xl font-bold text-gray-800">Progress Tracking</h2>
    <p className="text-gray-600">
      Coming soon: view your speaking history, accuracy, and more!
    </p>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/progress" element={<ProgressTracking />} />
        <Route path="/about" element={<About />} /> {/* This is the About page route */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/microphone" element={<ExercisesPage />} />
        <Route path="/microphone/:id" element={<PracticeExercise />} />
      </Routes>
    </>
  );
}

export default App;
