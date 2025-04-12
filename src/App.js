import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from './firebase';

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
import ProgressTracking from './components/ProgressTracking';
import AssessmentsPage from './components/AssessmentsPage';
import ChatPage from './components/ChatPage';

import ClientExercisesPage from './components/ClientExercisesPage';
import ExerciseView from './components/ExerciseView';

function App() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('uid', user.uid);
      } else {
        localStorage.removeItem('uid');
      }
    });
    return () => unsubscribe();
  }, []);

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

        {/* ✅ Assigned Exercises Page for Clients */}
        <Route path="/my-exercises" element={
          <PrivateRoute>
            <ClientExercisesPage />
          </PrivateRoute>
        } />

        {/* ✅ Firestore Exercise Viewer */}
        <Route path="/exercise/:id" element={
          <PrivateRoute>
            <ExerciseView />
          </PrivateRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<h2 className="text-center mt-10">404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
