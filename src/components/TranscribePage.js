import React, { useState, useRef } from 'react';
import { FaMicrophone, FaSave, FaDownload, FaUserMd, FaChild } from 'react-icons/fa';

const TranscribePage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [transcriptLog, setTranscriptLog] = useState([]);
  const [comments, setComments] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [speakerMap, setSpeakerMap] = useState({});

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
      const newLine = { speaker: 'Live', text };
      setTranscriptLog(prev => [...prev, newLine]);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.start();
  };

  const handleSpeakerLabelChange = (speaker, role) => {
    setSpeakerMap(prev => ({ ...prev, [speaker]: role }));
  };

  const recordAndSendToAssemblyAI = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    const audioBlobPromise = new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };
    });

    mediaRecorder.start();
    setListening(true);
    setTimeout(() => mediaRecorder.stop(), 5000);

    const audioBlob = await audioBlobPromise;
    setListening(false);

    const uploadRes = await fetch('https://your-server.com/api/upload', {
      method: 'POST',
      body: audioBlob,
    });
    const { audio_url } = await uploadRes.json();

    const transcriptRes = await fetch('https://your-server.com/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_url }),
    });

    const { id } = await transcriptRes.json();

    while (true) {
      const polling = await fetch(`https://your-server.com/api/transcribe/${id}`);
      const data = await polling.json();

      if (data.status === 'completed') {
        const grouped = {};
        data.words.forEach(word => {
          if (!grouped[word.speaker]) grouped[word.speaker] = [];
          grouped[word.speaker].push(word.text);
        });

        Object.entries(grouped).forEach(([speaker, words]) => {
          const newLine = { speaker, text: words.join(' ') };
          setTranscriptLog(prev => [...prev, newLine]);
        });
        break;
      }
      if (data.status === 'error') {
        console.error('❌ Error:', data.error);
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
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
    setSpeakerMap({});
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
          <button onClick={handleStartTranscription} className="rounded-full p-3 text-xl text-white bg-green-600 hover:bg-green-700 transition">
            <FaMicrophone />
          </button>
          <button onClick={recordAndSendToAssemblyAI} className="rounded-full px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg">
            🎧 Record & Analyze
          </button>
        </div>

        <div className="text-sm text-center text-gray-700">
          {listening ? '🎙️ Listening...' : '🔇 Paused'}
        </div>

        <div className="bg-blue-100 p-4 rounded-xl">
          <h4 className="font-semibold text-blue-700 mb-2">Transcript Log with Speakers</h4>
          {transcriptLog.length === 0 ? (
            <p className="text-sm text-gray-500">No transcript yet.</p>
          ) : (
            <div className="space-y-3">
              {transcriptLog.map((line, i) => (
                <div key={i} className={`p-3 rounded-lg ${line.speaker === 'A' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                  <p className="text-sm font-semibold text-gray-600">
                    {speakerMap[line.speaker] || `Speaker ${line.speaker}`}:
                  </p>
                  <p className="text-md">{line.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Speaker label mapping UI */}
          {Array.from(new Set(transcriptLog.map(line => line.speaker))).map((sp, i) => (
            <div key={i} className="mt-2">
              <label className="mr-2 text-sm font-medium">Label for {sp}:</label>
              <select
                value={speakerMap[sp] || ''}
                onChange={(e) => handleSpeakerLabelChange(sp, e.target.value)}
                className="rounded px-2 py-1 border border-gray-300"
              >
                <option value="">Select Role</option>
                <option value="Therapist">Therapist</option>
                <option value="Child">Child</option>
              </select>
            </div>
          ))}
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
    </div>
  );
};

export default TranscribePage;