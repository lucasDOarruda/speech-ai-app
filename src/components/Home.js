import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="text-center space-y-10 p-6 bg-gradient-to-br from-blue-50 via-yellow-50 to-white min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="pt-10">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to Speech AI</h1>
        <p className="text-gray-700 max-w-xl mx-auto text-lg mt-2">
          This app helps with speech pathology using interactive, AI-powered voice exercises.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto pt-4">
        <FeatureCard
          title="🎙 Microphone Input"
          desc="Speak directly to your browser and receive instant feedback."
          onClick={() => navigate('/microphone')}
          color="from-yellow-100 to-blue-100"
        />
        <FeatureCard
          title="📊 Progress Tracking"
          desc="Monitor improvement with personalized stats."
          onClick={() => navigate('/progress')}
          color="from-blue-100 to-yellow-100"
        />
        <FeatureCard
          title="🏠 Home"
          desc="Quickly return to your starting point and reset."
          onClick={() => navigate('/')}
          color="from-white to-yellow-50"
        />
        <FeatureCard
          title="ℹ️ About"
          desc="Learn how Speech AI empowers communication through technology."
          onClick={() => navigate('/about')}
          color="from-yellow-50 to-blue-50"
        />
      </div>

      {/* Extra Info Section */}
      <div className="max-w-xl mx-auto mt-12 text-gray-700 text-md space-y-4">
        <p>
          🧠 <span className="font-semibold text-blue-600">Powered by AI:</span> We use Whisper and GPT to guide your speech practice intelligently.
        </p>
        <p>
          💬 <span className="font-semibold text-yellow-600">Interactive & Instant:</span> Say it and see feedback live — no wait time, no guesswork.
        </p>
        <p>
          🧑‍⚕️ <span className="font-semibold text-blue-600">Speech Therapist Friendly:</span> Built to support professional-level goals while staying user-friendly.
        </p>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ title, desc, onClick, color = 'from-white to-gray-100' }) => (
  <motion.div
    className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition transform hover:scale-105`}
    whileHover={{ scale: 1.03 }}
    onClick={onClick}
  >
    <h3 className="text-xl font-semibold text-blue-800">{title}</h3>
    <p className="text-gray-800 mt-1">{desc}</p>
  </motion.div>
);

export default Home;
