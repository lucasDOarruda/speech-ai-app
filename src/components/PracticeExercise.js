// PracticeExercise.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, CheckCircle, XCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001'
  : 'https://speech-ai-app-backend.onrender.com';

const defaultExercises = {
  1: {
    title: 'S Sound Practice',
    targetWords: ['Snake', 'Sun', 'Smile'],
    videoUrl: '/videos/s-sound-demo.mp4',
    gptFeedback: 'Try saying the /s/ sound clearly. Trap your tongue behind your teeth!',
  },
};

const PracticeExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      if (parseInt(id) === 1) {
        setExercise(defaultExercises[1]);
        return;
      }

      // Try to get from Firestore
      const uid = auth.currentUser?.uid || localStorage.getItem('uid');
      if (uid) {
        const docRef = doc(db, 'users', uid, 'assignedExercises', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExercise(docSnap.data());
          return;
        }
      }

      // Fallback to localStorage
      const customList = JSON.parse(localStorage.getItem('customExercises')) || [];
      const found = customList.find((ex) => ex.id.toString() === id);
      if (found) {
        setExercise(found);
      } else {
        setExercise(null);
      }
    };

    fetchExercise();
  }, [id]);

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

    recognition.onstart = () => {
      setIsRecording(true);
      setMessage('');
      setAccuracy(null);
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

        const correct = exercise?.targetWords?.some((word) => transcript.includes(word.toLowerCase()));
        const percentage = correct ? 100 : 0;

        setAccuracy(percentage);
        setMessage(correct ? '✅ Great job! Correct pronunciation.' : `❌ ${exercise.gptFeedback || feedback}`);

        const utter = new SpeechSynthesisUtterance(correct ? 'Correct pronunciation!' : 'Try again.');
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
    };

    recognition.start();
  };

  const handleStop = () => {
    setIsRecording(false);
    setMessage('Recording stopped.');
  };

  const formatYouTubeUrl = (url) => {
    if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  if (!exercise) {
    return <p className="text-center text-red-500 mt-10">Exercise not found.</p>;
  }

  if (showIntro && exercise.videoUrl) {
    const isYouTube = exercise.videoUrl.includes('youtube.com') || exercise.videoUrl.includes('youtu.be');

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-blue-600">{exercise.title}</h2>
          <p className="text-gray-700">Watch this video before starting:</p>
          {isYouTube ? (
            <iframe
              width="100%"
              height="315"
              src={formatYouTubeUrl(exercise.videoUrl)}
              title="Exercise video"
              frameBorder="0"
              allowFullScreen
              className="rounded-xl"
            />
          ) : (
            <video controls className="mx-auto rounded-xl max-h-64">
              <source src={exercise.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <button onClick={() => setShowIntro(false)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-2xl text-center space-y-6">
        <h2 className="text-3xl font-bold text-blue-600">{exercise.title}</h2>
        <p className="text-gray-700 text-lg">Try saying one of the following words:</p>

        <div className="flex flex-wrap justify-center gap-4">
          {exercise.targetWords?.map((word, index) => (
            <span key={index} className="bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full text-base font-medium">
              {word}
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleListen}
            disabled={isRecording}
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
          <button onClick={() => navigate(-1)} className="text-sm text-blue-500 underline">
            ← Back to Exercises
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeExercise;
