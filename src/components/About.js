import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      className="text-center space-y-10 p-6 bg-gradient-to-br from-blue-50 via-yellow-50 to-white min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="pt-10">
        <h1 className="text-4xl font-bold text-blue-600">About This App</h1>
        <p className="text-gray-700 max-w-xl mx-auto text-lg mt-2">
          This app assists with speech pathology practice using AI tools like Whisper, GPT, and real-time voice recognition.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2 pt-4">
        <FeatureCard
          title="🧠 Powered by AI"
          desc="We use Whisper and GPT to guide your speech practice intelligently."
        />
        <FeatureCard
          title="💬 Interactive & Instant"
          desc="Say it and see feedback live — no wait time, no guesswork."
        />
        <FeatureCard
          title="🧑‍⚕️ Speech Therapist Friendly"
          desc="Built to support professional-level goals while staying user-friendly."
        />
      </div>
      
      {/* Footer Section */}
      <div className="text-gray-700 mt-8">
        <p className="text-lg">
          This app is designed for users of all levels, from beginner to advanced speech therapy practice.
        </p>
        <p className="text-lg mt-2">
          Enjoy practicing your speech with real-time feedback and improve your pronunciation every day!
        </p>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <motion.div
    className="bg-gradient-to-br from-yellow-100 to-blue-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105"
    whileHover={{ scale: 1.03 }}
  >
    <h3 className="text-xl font-semibold text-blue-800">{title}</h3>
    <p className="text-gray-800 mt-1">{desc}</p>
  </motion.div>
);

export default About;
