import React, { useState, useRef } from 'react';
import { FaMicrophone, FaSave, FaDownload, FaUserMd, FaChild } from 'react-icons/fa';

const TranscribePage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [transcriptLog, setTranscriptLog] = useState([]);
  const [isTherapist, setIsTherapist] = useState(true);
  const [comments, setComments] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const sessionsPerPage = 5;

  const fullName = (name + ' ' + surname).trim();

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    return recognition;
  };

  const handleStartTranscription = () => {
    const recognition = initSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      const newLine = { speaker: isTherapist ? 'Therapist' : 'Child', text };
      setTranscriptLog(prev => [...prev, newLine]);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.start();
  };

  const handleSaveTranscript = () => {
    const timestamp = new Date().toLocaleString();
    const session = {
      fullName,
      age,
      timestamp,
      comments,
      log: [...transcriptLog]
    };
    setSessionHistory(prev => [...prev, session]);
    setTranscriptLog([]);
    setComments('');
    setCurrentPage(1);
  };

  const handleDownload = (session) => {
    const lines = session.log.map(t => `${t.speaker}: ${t.text}`);
    const fullText = `Patient: ${session.fullName} (Age: ${session.age})\nDate: ${session.timestamp}\n\n${lines.join('\n')}\n\nComments:\n${session.comments}`;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = session.fullName.replace(/ /g, '_') + '-session.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSessions = sessionHistory.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  );

  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-blue-700">🧠 Session Transcription</h2>

      <div className="bg-blue-50 rounded-xl p-4 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="First Name" value={name} onChange={e => setName(e.target.value)} className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none" />
          <input type="text" placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)} className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none" />
          <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="w-24 rounded-full px-4 py-2 border border-gray-300 focus:outline-none" />
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => setIsTherapist(true)} className={`rounded-full p-3 text-xl transition ${isTherapist ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}>
            <FaUserMd />
          </button>
          <button onClick={() => setIsTherapist(false)} className={`rounded-full p-3 text-xl transition ${!isTherapist ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}>
            <FaChild />
          </button>
          <button onClick={handleStartTranscription} className="rounded-full p-3 text-xl text-white bg-green-600 hover:bg-green-700 transition">
            <FaMicrophone />
          </button>
        </div>

        <div className="text-sm text-center text-gray-700">
          <strong>{isTherapist ? 'Therapist' : 'Child'}:</strong> {listening ? 'Listening...' : 'Paused'}
        </div>

        <div className="bg-blue-100 p-4 rounded-xl">
          <h4 className="font-semibold text-blue-700 mb-2">Transcript Log</h4>
          {transcriptLog.length === 0 ? (
            <p className="text-sm text-gray-500">No transcript yet.</p>
          ) : (
            transcriptLog.map((line, i) => (
              <p key={i} className="text-sm"><strong>{line.speaker}:</strong> {line.text}</p>
            ))
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="font-semibold mb-2 block">📝 Therapist Comments:</label>
          <textarea value={comments} onChange={e => setComments(e.target.value)} className="w-full p-3 rounded-md border border-gray-300" rows="4"></textarea>
        </div>

        <div className="flex justify-center">
          <button onClick={handleSaveTranscript} disabled={!fullName || !transcriptLog.length} className="bg-green-500 text-white px-6 py-2 rounded-full mt-2 flex items-center gap-2 hover:bg-green-600 transition">
            <FaSave /> Save Session
          </button>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-2">📚 Previous Sessions</h3>
        <input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-2 mb-4 border rounded-full" />

        {paginatedSessions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No sessions found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {paginatedSessions.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all p-4 flex flex-col items-center text-center border border-gray-100">
                <p className="text-blue-700 font-bold text-md">{s.fullName} <span className="text-gray-500">(Age {s.age})</span></p>
                <p className="text-sm text-gray-400">📅 {s.timestamp}</p>
                <p className="text-sm text-gray-600 italic mt-2 line-clamp-2">💬 {s.comments.slice(0, 100)}...</p>
                <button onClick={() => handleDownload(s)} className="mt-4 text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-125">
                  <FaDownload className="h-8 w-8" />
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="text-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button key={index} onClick={() => setCurrentPage(index + 1)} className={`px-3 py-1 rounded-full text-sm font-medium ${index + 1 === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'} hover:scale-105 transition`}>
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscribePage;