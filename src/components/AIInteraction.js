import React, { useState } from 'react';

const AIInteraction = () => {
  const [text, setText] = useState('');

  const handleSpeak = () => {
    alert(`Pretend AI is processing: ${text}`);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Say something to AI"
        className="w-full border rounded px-4 py-2"
      />
      <button
        onClick={handleSpeak}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Speak with AI
      </button>
    </div>
  );
};

export default AIInteraction;
