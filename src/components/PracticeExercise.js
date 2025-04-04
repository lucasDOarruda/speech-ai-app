
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, CheckCircle, XCircle } from 'lucide-react';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001'
  : 'https://speech-ai-app-backend.onrender.com';

const exercises = {
  1: { title: 'S Sound Practice', targetWords: ['Snake', 'Sun', 'Smile'] },
  2: { title: 'R Sound Practice', targetWords: ['Rabbit', 'Red', 'Round'] },
  3: { title: 'Tongue Strengthening', targetWords: ['Up', 'Down', 'Side'] },
  4: { title: 'Lip Closure Drill', targetWords: ['Pa', 'Ba', 'Ma'] },
  5: { title: 'Breath Support Training', targetWords: ['Ahh', 'Oh', 'Eee'] },
  6: { title: 'Ch Sound Practice', targetWords: ['Chair', 'Cheese', 'Chalk'] },
  7: { title: 'Th Sound Clarity', targetWords: ['This', 'Think'] },
  8: { title: 'Z Sound Emphasis', targetWords: ['Zebra', 'Zoom', 'Buzz'] },
  9: { title: 'Sentence Repetition', targetWords: ['I can see the sun.'] },
  10: { title: 'Minimal Pairs Drill', targetWords: ['Bat', 'Pat', 'Cap', 'Cab'] },
};

const PracticeExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = exercises[id];

  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [recordTime, setRecordTime] = useState(0);

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const startTime = Date.now();

    recognition.onstart = () => {
      setIsRecording(true);
      setMessage('');
      setAccuracy(null);
      setRecordTime(0);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      if (!transcript || transcript.trim().length === 0) {
        setMessage('⚠️ No speech detected. Please try again.');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript }),
        });

        const data = await res.json();
        const feedback = data.reply;

        setMessage(feedback);

        const correct = exercise.targetWords.some((word) => transcript.includes(word.toLowerCase()));
        const percentage = correct ? 100 : 0;

        setAccuracy(percentage);

        const utter = new SpeechSynthesisUtterance(correct ? "Correct pronunciation!" : "Try again.");
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);

      } catch (err) {
        console.error('AI error:', err);
        setMessage('⚠️ Something went wrong. Please try again.');
      }
    };

    recognition.onerror = (event) => {
      setMessage('⚠️ Error occurred: ' + event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordTime((Date.now() - startTime) / 1000);
    };

    recognition.start();
  };

  const handleStop = () => {
    setIsRecording(false);
    setMessage('Recording stopped.');
  };

  if (!exercise) return <p className="text-center text-red-500 mt-10">Exercise not found.</p>;

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-2xl text-center space-y-6">
        <h2 className="text-3xl font-bold text-blue-600">{exercise.title}</h2>
        <p className="text-gray-700 text-lg">Try saying one of the following words:</p>

        <div className="flex flex-wrap justify-center gap-4">
          {exercise.targetWords.map((word, index) => (
            <span key={index} className="bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full text-base font-medium">
              {word}
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleListen}
            disabled={isRecording || isListening}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition text-base font-medium"
          >
            <Mic size={20} />
            {isRecording ? 'Recording...' : 'Start Speaking'}
          </button>

          {isRecording && (
            <button
              onClick={handleStop}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition text-base font-medium"
            >
              Stop Recording
            </button>
          )}
        </div>

        {message && <div className="text-lg font-semibold text-gray-800">{message}</div>}

        {accuracy !== null && (
          <div className="mt-4">
            <p className="text-lg">Pronunciation Accuracy: {accuracy}%</p>
            {accuracy === 100 ? (
              <CheckCircle size={30} className="text-green-500 mt-2" />
            ) : (
              <XCircle size={30} className="text-red-500 mt-2" />
            )}
          </div>
        )}

        <div>
          <button onClick={() => navigate('/microphone')} className="text-sm text-blue-500 underline">
            ← Back to Exercises
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeExercise;