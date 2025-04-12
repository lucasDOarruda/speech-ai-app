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

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'therapist'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTherapists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const startChat = async (therapistId, email) => {
    const chatId = await getOrCreateChatId(auth.currentUser.uid, therapistId);
    setChatId(chatId);
    setSelectedTherapistEmail(email);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-md">
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

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-700">
          🧠 Your Study Space
        </h2>

        {chatId ? (
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Chatting with: {selectedTherapistEmail}
            </h3>
            <ChatWindow chatId={chatId} />
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Select a therapist to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
