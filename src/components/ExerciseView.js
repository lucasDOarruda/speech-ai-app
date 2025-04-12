import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Mic, CheckCircle, XCircle } from 'lucide-react';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001'
  : 'https://speech-ai-app-backend.onrender.com';

const ExerciseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [error, setError] = useState('');
  const [showPractice, setShowPractice] = useState(false);
  const [message, setMessage] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const userId = localStorage.getItem('uid');
        const docRef = doc(db, 'users', userId, 'assignedExercises', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setExercise(docSnap.data());
        } else {
          setError('Exercise not found.');
        }
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError('Failed to load exercise.');
      }
    };

    fetchExercise();
  }, [id]);

  const formatYouTubeUrl = (url) => {
    if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

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

      if (!transcript) {
        setMessage('⚠️ No speech detected. Try again.');
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

        const correct = exercise?.targetWords?.some(word => transcript.includes(word.toLowerCase()));
        setAccuracy(correct ? 100 : 0);
        setMessage(correct ? '✅ Great job!' : `❌ ${exercise.gptFeedback || feedback}`);

        const utter = new SpeechSynthesisUtterance(correct ? 'Correct!' : 'Try again.');
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.error(err);
        setMessage('⚠️ Something went wrong. Try again.');
      }
    };

    recognition.onerror = (event) => {
      setMessage('⚠️ Error: ' + event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!exercise) return <div className="text-center mt-10 text-gray-500">Loading exercise...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow max-w-xl w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-blue-600">{exercise.title}</h2>

        {!showPractice ? (
          <>
            <p className="text-gray-700">Watch this video before starting:</p>
            {exercise.videoUrl && (
              <div>
                {exercise.videoUrl.includes('youtube.com') || exercise.videoUrl.includes('youtu.be') ? (
                  <iframe
                    width="100%"
                    height="280"
                    src={formatYouTubeUrl(exercise.videoUrl)}
                    title={exercise.title}
                    allowFullScreen
                    className="rounded-xl"
                  />
                ) : (
                  <video controls className="w-full rounded-xl max-h-64">
                    <source src={exercise.videoUrl} type="video/mp4" />
                    Video not supported.
                  </video>
                )}
              </div>
            )}
            <button
              onClick={() => setShowPractice(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              Start Practice
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700 text-lg">Try saying one of the following words:</p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {(exercise.targetWords || []).map((word, i) => (
                <span
                  key={i}
                  className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {word}
                </span>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleListen}
                disabled={isRecording}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
              >
                <Mic size={20} />
                {isRecording ? 'Recording...' : 'Start Speaking'}
              </button>
            </div>

            {message && <div className="text-base font-medium mt-4">{message}</div>}
            {accuracy !== null && (
              <div className="mt-2 text-lg">
                <p>Pronunciation Accuracy: {accuracy}%</p>
                {accuracy === 100 ? (
                  <CheckCircle size={30} className="text-green-500 mx-auto mt-2" />
                ) : (
                  <XCircle size={30} className="text-red-500 mx-auto mt-2" />
                )}
              </div>
            )}

            <div className="mt-6">
              <button onClick={() => navigate(-1)} className="text-sm text-blue-600 underline">
                ← Back to Exercises
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseView;
