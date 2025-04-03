import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-yellow-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">🎉 Welcome to Speech AI!</h2>
        <p className="text-gray-600 mb-6">Ready to improve your speech skills today?</p>

        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition"
            onClick={() => navigate('/practice')}
          >
            🗣️ Start Practice
          </button>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-xl transition"
            onClick={() => navigate('/progress')}
          >
            📊 View Progress
          </button>
          <button
            className="mt-4 text-sm text-gray-500 hover:underline"
            onClick={handleLogout}
          >
            🔓 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
