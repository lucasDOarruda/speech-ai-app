import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Simulated data
const exercises = ['S', 'R', 'Ch', 'Z', 'Th', 'Minimal', 'Sentence'];
const correct = [8, 6, 5, 7, 4, 6, 9];
const errors = [2, 4, 5, 3, 6, 4, 1];
const totalPoints = correct.reduce((sum, val) => sum + val * 10, 0);
const maxPoints = 1000;
const percentage = Math.min((totalPoints / maxPoints) * 100, 100).toFixed(1);

const data = {
  labels: exercises,
  datasets: [
    {
      label: 'Correct',
      data: correct,
      backgroundColor: '#60A5FA', // blue-400
    },
    {
      label: 'Errors',
      data: errors,
      backgroundColor: '#F87171', // red-400
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: 'Speech Exercise Accuracy',
      color: '#1D4ED8',
      font: { size: 20 },
    },
  },
};

const ProgressTracking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-blue-50 to-white px-6 py-10">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-3xl font-bold text-blue-600">📈 Progress Tracking</h2>
        <p className="text-gray-700 text-lg">Visualize your pronunciation accuracy and score growth.</p>

        <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner mt-6">
          <div
            className="bg-gradient-to-r from-yellow-400 to-blue-500 h-6 rounded-full text-white font-semibold text-sm flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          >
            {totalPoints} / 1000 Points
          </div>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl mt-6">
          <Bar data={data} options={options} />
        </div>

        <p className="text-sm text-gray-500 italic">
          Keep practicing to level up your Speech AI mastery! 🎯
        </p>
      </div>
    </div>
  );
};

export default ProgressTracking;
