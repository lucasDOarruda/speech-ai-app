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
import { useNavigate } from 'react-router-dom';
import {
  FaComments,
  FaEdit,
  FaTasks,
  FaChartLine,
  FaVideo,
} from 'react-icons/fa';

// Get or create a chat ID between therapist and client
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

const TherapistDashboard = () => {
  const [clients, setClients] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [selectedClientEmail, setSelectedClientEmail] = useState('');
  const navigate = useNavigate();

  // Load all clients from Firestore
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'client'));
    const unsub = onSnapshot(q, (snapshot) => {
      setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, []);

  // Start or resume chat
  const startChat = async (clientId, email) => {
    const chatId = await getOrCreateChatId(clientId, auth.currentUser.uid);
    setChatId(chatId);
    setSelectedClientEmail(email);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
          <FaComments /> Connected Clients
        </h2>
        {clients.map((c) => (
          <div
            key={c.id}
            onClick={() => startChat(c.id, c.email)}
            className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${
              chatId && selectedClientEmail === c.email
                ? 'bg-blue-200 font-semibold'
                : ''
            }`}
          >
            {c.email}
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          👩‍⚕️ Therapist Dashboard
        </h2>

        {/* Chat Window */}
        {chatId ? (
          <div className="bg-white rounded shadow p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Chatting with: {selectedClientEmail}
            </h3>
            <ChatWindow chatId={chatId} />
          </div>
        ) : (
          <div className="text-center text-gray-600 mb-6">
            Select a client to start chatting and assign exercises.
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <ToolCard
            icon={<FaVideo />}
            title="Transcribe Sessions"
            onClick={() => navigate('/transcribe')}
          />
          <ToolCard
            icon={<FaEdit />}
            title="Practice Exercises"
            onClick={() => navigate('/exercises')}
          />
          <ToolCard
            icon={<FaTasks />}
            title="Assessments"
            onClick={() => navigate('/assessments')}
          />
          <ToolCard
            icon={<FaChartLine />}
            title="Progress Tracking"
            onClick={() => navigate('/progress')}
          />
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const ToolCard = ({ icon, title, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2"
  >
    <div className="text-2xl text-blue-600">{icon}</div>
    <div className="font-semibold text-gray-700 text-sm">{title}</div>
  </div>
);

export default TherapistDashboard;
