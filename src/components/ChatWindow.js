import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId: auth.currentUser.uid,
      text: input,
      createdAt: serverTimestamp(),
    });

    setInput('');
  };

  return (
    <div className="p-4 border rounded bg-white shadow-md max-w-3xl mx-auto">
      <div className="h-64 overflow-y-scroll border p-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === auth.currentUser.uid ? 'text-right' : 'text-left'}`}>
            <div className="text-sm">{msg.text}</div>
            <div className="text-xs text-gray-400">{msg.senderId}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
