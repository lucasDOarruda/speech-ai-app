import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { FaPaperPlane } from 'react-icons/fa';
import ChatWindow from './ChatWindow';

export default function ChatPage() {
  const { userId } = useParams();  // Getting the userId from the URL params
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = doc(db, 'messages', `${userId}_${auth.currentUser.uid}`);
    
    const unsubscribe = onSnapshot(messagesRef, (docSnap) => {
      const data = docSnap.data();
      if (data && data.messages) {
        setMessages(data.messages);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(userId, message); // Send the message to Firestore
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <div className="h-96 overflow-y-scroll mb-4">
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`p-2 mb-2 ${msg.senderId === auth.currentUser.uid ? 'text-right' : ''}`}>
              <div className="font-semibold">{msg.senderId === auth.currentUser.uid ? 'You' : 'Client'}</div>
              <div>{msg.message}</div>
              <div className="text-sm text-gray-500">{msg.timestamp?.toDate().toLocaleString()}</div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
