import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { FaComments } from 'react-icons/fa';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: newMsg,
      senderId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setNewMsg('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="w-full h-[400px] border rounded shadow p-2 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto space-y-2 px-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === auth.currentUser.uid ? 'justify-end' : 'justify-start'
            } animate-bounce-once`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                msg.senderId === auth.currentUser.uid
                  ? 'bg-indigo-500 text-white'
                  : 'bg-green-400 text-black'
              }`}
              style={{
                maxWidth: '70%',
                width: 'fit-content',
                wordBreak: 'break-word',
              }}
            >
              <FaComments className="text-xs opacity-80" />
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          placeholder="Type message... 😊"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-l px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-500 text-white px-4 py-2 rounded-r text-sm hover:bg-indigo-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
