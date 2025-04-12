import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import ChatWindow from './ChatWindow';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const getOrCreateChatId = async (clientId, therapistId) => {
  const chatId = [clientId, therapistId].sort().join('_');
  const chatRef = doc(db, 'chats', chatId);
  const docSnap = await getDoc(chatRef);

  if (!docSnap.exists()) {
    await setDoc(chatRef, {
      participants: [clientId, therapistId],
      createdAt: new Date(),
    });
  }

  return chatId;
};

const ClientDashboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [selectedTherapistEmail, setSelectedTherapistEmail] = useState('');
  const [assignedExercises, setAssignedExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'therapist'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTherapists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = collection(db, 'users', userId, 'assignedExercises');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const exercises = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAssignedExercises(exercises);
    });

    return unsubscribe;
  }, []);

  const startChat = async (therapistId, email) => {
    const chatId = await getOrCreateChatId(auth.currentUser.uid, therapistId);
    setChatId(chatId);
    setSelectedTherapistEmail(email);
  };

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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
          <FaComments /> Available Therapists
        </h2>
        {therapists.map((t) => (
          <div
            key={t.id}
            onClick={() => startChat(t.id, t.email)}
            className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${
              chatId && selectedTherapistEmail === t.email
                ? 'bg-blue-200 font-semibold'
                : ''
            }`}
          >
            {t.email}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-700">
          🧠 Your Study Space
        </h2>

        {/* Chat Window */}
        {chatId ? (
          <div className="bg-white rounded shadow p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Chatting with: {selectedTherapistEmail}
            </h3>
            <ChatWindow chatId={chatId} />
          </div>
        ) : (
          <div className="text-center text-gray-600 mb-6">
            Select a therapist to start chatting.
          </div>
        )}

        {/* Assigned Exercises Section */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            📚 Assigned Exercises
          </h3>
          {assignedExercises.length === 0 ? (
            <p className="text-gray-600">No exercises assigned yet.</p>
          ) : (
            assignedExercises.map((ex) => (
              <div
                key={ex.id}
                className="mb-6 p-4 bg-green-50 border rounded-xl shadow"
              >
                <h4 className="text-lg font-semibold text-blue-800">
                  {ex.title}
                </h4>
                <p className="text-gray-700 mb-2">{ex.description}</p>

                {ex.videoUrl && (
                  <div className="mb-4">
                    {ex.videoUrl.includes('youtube.com') || ex.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={formatYouTubeUrl(ex.videoUrl)}
                        className="w-full rounded-lg"
                        height="240"
                        allowFullScreen
                        title="Exercise Video"
                      />
                    ) : (
                      <video
                        src={ex.videoUrl}
                        controls
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                )}

                <button
                  onClick={() => navigate(`/exercise/${ex.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Start Exercise
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
