import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import PrivateRoute from './components/PrivateRoute';

import ClientDashboard from './components/ClientDashboard';
import TherapistDashboard from './components/TherapistDashboard';
import TranscribePage from './components/TranscribePage';
import ExercisesPage from './components/ExercisesPage';
import PracticeExercise from './components/PracticeExercise';
import ProgressTracking from './components/ProgressTracking';
import AssessmentsPage from './components/AssessmentsPage';
import ChatPage from './components/ChatPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ✅ Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ Public Pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* ✅ Dashboards */}
        <Route path="/client-dashboard" element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        } />

        <Route path="/therapist-dashboard" element={
          <PrivateRoute>
            <TherapistDashboard />
          </PrivateRoute>
        } />

        {/* ✅ Feature Pages */}
        <Route path="/transcribe" element={
          <PrivateRoute>
            <TranscribePage />
          </PrivateRoute>
        } />

        <Route path="/exercises" element={
          <PrivateRoute>
            <ExercisesPage />
          </PrivateRoute>
        } />

        {/* ✅ Updated: Handle exercise by ID with cleaner route */}
        <Route path="/exercise/:id" element={
          <PrivateRoute>
            <PracticeExercise />
          </PrivateRoute>
        } />

        <Route path="/progress" element={
          <PrivateRoute>
            <ProgressTracking />
          </PrivateRoute>
        } />

        <Route path="/assessments" element={
          <PrivateRoute>
            <AssessmentsPage />
          </PrivateRoute>
        } />

        <Route path="/chat/:userId" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<h2 className="text-center mt-10">404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
