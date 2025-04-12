import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ClientExercisesPage = () => {
  const navigate = useNavigate();
  const [assignedExercises, setAssignedExercises] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, 'users', user.uid, 'assignedExercises');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const exercises = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignedExercises(exercises);
    });

    return unsubscribe;
  }, []);

  const formatYouTubeUrl = (url) => {
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">🧠 Your Assigned Exercises</h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {assignedExercises.length === 0 ? (
          <p className="text-center text-gray-500">No exercises assigned yet.</p>
        ) : (
          assignedExercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-white p-6 rounded-xl shadow-md border space-y-4"
            >
              <h2 className="text-xl font-semibold text-blue-800">{ex.title}</h2>
              <p className="text-gray-700">{ex.description}</p>

              {ex.videoUrl && (
                <div>
                  {ex.videoUrl.includes('youtube.com') || ex.videoUrl.includes('youtu.be') ? (
                    <iframe
                      width="100%"
                      height="260"
                      src={formatYouTubeUrl(ex.videoUrl)}
                      title={ex.title}
                      allowFullScreen
                      className="rounded-xl"
                    />
                  ) : (
                    <video
                      src={ex.videoUrl}
                      controls
                      className="w-full rounded-xl"
                    />
                  )}
                </div>
              )}

              <button
                onClick={() => navigate(`/exercise/${ex.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Start Exercise
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientExercisesPage;
