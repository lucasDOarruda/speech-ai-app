import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import ChatWindow from './ChatWindow';

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

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'therapist'));
    const unsub = onSnapshot(q, (snapshot) => {
      setTherapists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, []);

  const startChat = async (therapistId) => {
    const chatId = await getOrCreateChatId(auth.currentUser.uid, therapistId);
    setChatId(chatId);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🧠 Your Study Space</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">👩‍⚕️ Available Therapists</h3>
          {therapists.map(t => (
            <div key={t.id} onClick={() => startChat(t.id)} className="p-2 bg-white rounded mb-2 cursor-pointer hover:bg-gray-200">
              {t.email}
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">📋 Assigned Exercises</h3>
          <p>No exercises assigned yet.</p>
        </div>
      </div>

      {chatId && <ChatWindow chatId={chatId} />}
    </div>
  );
};

export default ClientDashboard;
