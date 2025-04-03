
import React, { useState, useRef } from 'react';

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

  const fullName = `${name} ${surname}`.trim();

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
    setTranscriptLog([]);
    setListening(true);
    startRecognition();
  };

  const handleNextSpeaker = () => {
    setIsTherapist(prev => !prev);
    startRecognition();
  };

  const startRecognition = () => {
    const recognition = initSpeechRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    recognition.start();

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      const newLine = { speaker: isTherapist ? 'Therapist' : 'Child', text };
      setTranscriptLog(prev => [...prev, newLine]);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
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
    const fullText = `Patient: ${session.fullName} (Age: ${session.age})\nDate: ${session.timestamp}\n\n` +
                     lines.join('\n') + `\n\nComments:\n${session.comments}`;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.fullName.replace(/ /g, "_")}-session.txt`;
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
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2563EB' }}>🧠 Session Transcription</h2>

      <div style={{
        background: '#E0F2FE', padding: '1.5rem', borderRadius: '1rem',
        display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center'
      }}>
        <input placeholder="First Name" value={name} onChange={e => setName(e.target.value)}
          style={{ flex: '1 1 200px', padding: '0.6rem 1rem', borderRadius: '999px',
          border: '1px solid #CBD5E1', backgroundColor: '#F0F9FF', fontSize: '1rem' }} />
        <input placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)}
          style={{ flex: '1 1 200px', padding: '0.6rem 1rem', borderRadius: '999px',
          border: '1px solid #CBD5E1', backgroundColor: '#F0F9FF', fontSize: '1rem' }} />
        <input placeholder="Age" type="number" value={age} onChange={e => setAge(e.target.value)}
          style={{ width: '100px', padding: '0.6rem 1rem', borderRadius: '999px',
          border: '1px solid #CBD5E1', backgroundColor: '#F0F9FF', fontSize: '1rem' }} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button onClick={handleStartTranscription} disabled={listening || !fullName || !age}
          style={{ background: '#2563EB', color: '#fff', padding: '0.6rem 1.2rem', border: 'none',
          borderRadius: '8px', cursor: 'pointer', marginRight: '1rem' }}>
          🎙️ Start Transcribing
        </button>
        <button onClick={handleNextSpeaker} disabled={listening || !fullName}
          style={{ background: '#FBBF24', padding: '0.6rem 1.2rem', color: '#000',
          border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          🔄 Next Speaker ({isTherapist ? 'Therapist' : 'Child'})
        </button>
      </div>

      <div style={{
        background: '#E0F2FE', padding: '1rem', borderRadius: '10px', marginBottom: '1rem'
      }}>
        <strong>{isTherapist ? 'Therapist' : 'Child'}:</strong> {listening ? 'Listening...' : 'Paused'}
      </div>

      <div style={{
        background: '#F0F9FF', padding: '1rem', borderRadius: '10px', marginBottom: '1rem'
      }}>
        <h4 style={{ color: '#2563EB' }}>Transcript Log</h4>
        {transcriptLog.map((line, i) => (
          <p key={i}><strong>{line.speaker}:</strong> {line.text}</p>
        ))}
      </div>

      <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
        <label><strong>📝 Therapist Comments:</strong></label>
        <textarea rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}
          value={comments} onChange={e => setComments(e.target.value)} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button onClick={handleSaveTranscript} disabled={!fullName || !transcriptLog.length}
          style={{ background: '#22C55E', color: '#fff', padding: '0.6rem 1.2rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          💾 Save Session
        </button>
      </div>

      <h3 style={{ marginBottom: '0.5rem' }}>📚 Previous Sessions</h3>
      <input placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #D1D5DB' }} />

      {paginatedSessions.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No sessions found.</p>
      )}

      
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    }}>
    {paginatedSessions.map((s, i) => (
    
        <div key={i} style={{
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          background: '#F0F9FF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ marginBottom: '0.3rem', color: '#2563EB' }}>{s.fullName} <span style={{ color: '#6B7280' }}>(Age {s.age})</span></h4>
          <p><strong>Date:</strong> {s.timestamp}</p>
          <p><strong>Comments:</strong> {s.comments.slice(0, 100)}...</p>
          <button onClick={() => handleDownload(s)} style={{
            marginTop: '0.5rem',
            background: '#2563EB', color: '#fff',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}>⬇️ Download</button>
        </div>
      ))}

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                margin: '0 0.25rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: index + 1 === currentPage ? '#2563EB' : '#E5E7EB',
                color: index + 1 === currentPage ? '#fff' : '#000',
                cursor: 'pointer'
              }}>
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