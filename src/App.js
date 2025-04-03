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
import About from './components/About';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AuthPage from './components/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import TranscribePage from './components/TranscribePage';

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
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/professional" element={<h2>Welcome, Professional!</h2>} />
        <Route
          path="/dashboard/patient"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <PrivateRoute>
              <Practice />
            </PrivateRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <PrivateRoute>
              <ProgressTracking />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/microphone" element={<ExercisesPage />} />
        <Route path="/microphone/:id" element={<PracticeExercise />} />
        <Route
          path="/transcribe"
          element={
            <PrivateRoute>
              <TranscribePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h2 className="text-center mt-10">404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;