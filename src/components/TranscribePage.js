import React, { useState, useEffect } from 'react';

const TranscribePage = () => {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [speaker, setSpeaker] = useState('Therapist');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onresult = (event) => {
      let transcriptChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcriptChunk += event.results[i][0].transcript;
      }
      setCurrentText(transcriptChunk);
    };

    recog.onend = () => {
      if (isListening) recog.start();
    };

    setRecognition(recog);
  }, [isListening]);

  const handleToggle = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      setCurrentText('');
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const handleNextSpeaker = () => {
    if (currentText.trim()) {
      setConversation((prev) => [...prev, { speaker, text: currentText.trim() }]);
      setCurrentText('');
    }
    setSpeaker((prev) => (prev === 'Therapist' ? 'Child' : 'Therapist'));
  };

  const handleDownload = () => {
    const fullText = conversation.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');
    const blob = new Blob([fullText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'session_transcript.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">📝 Session Transcription</h2>
      <p className="text-gray-600 mb-4">Start a real-time conversation and alternate speakers.</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        <button
          onClick={handleToggle}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? 'Stop Transcribing' : 'Start Transcribing'}
        </button>
        <button
          onClick={handleNextSpeaker}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition"
        >
          🎤 Next Speaker ({speaker})
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 text-left min-h-[100px]">
        <p className="text-gray-700 font-medium mb-1">{speaker}:</p>
        <p className="text-gray-900 whitespace-pre-wrap">{currentText || 'Listening…'}</p>
      </div>

      <div className="text-left bg-gray-50 rounded-xl shadow-inner p-4 space-y-2 mb-4">
        <h4 className="text-lg font-semibold text-blue-700 mb-2">Transcript Log</h4>
        {conversation.length === 0 ? (
          <p className="text-gray-400">No conversation yet…</p>
        ) : (
          conversation.map((line, index) => (
            <p key={index}><strong>{line.speaker}:</strong> {line.text}</p>
          ))
        )}
      </div>

      <button
        onClick={handleDownload}
        className="text-sm text-blue-600 hover:underline mt-2"
      >
        ⬇️ Download Transcript
      </button>
    </div>
  );
};

export default TranscribePage;