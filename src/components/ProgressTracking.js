import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const initialExercises = ['S', 'R', 'Ch', 'Z', 'Th', 'Minimal', 'Sentence'];
const initialPatients = {
  'Lucas': {
    age: 23,
    notes: 'idk',
    scores: Object.fromEntries(initialExercises.map(e => [e, 0])),
    errors: Object.fromEntries(initialExercises.map(e => [e, 0])),
  },
};

export default function ProgressTracking() {
  const [patients, setPatients] = useState(initialPatients);
  const [selected, setSelected] = useState(Object.keys(initialPatients)[0]);
  const [exercises, setExercises] = useState(initialExercises);

  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newExercise, setNewExercise] = useState('');

  const handleScoreChange = (exercise, value) => {
    const updated = { ...patients };
    updated[selected].scores[exercise] = parseInt(value) || 0;
    setPatients(updated);
  };

  const handleNewPatient = () => {
    if (!newName.trim()) return;
    const newPatient = {
      age: newAge,
      notes: newNotes,
      scores: Object.fromEntries(exercises.map(e => [e, 0])),
      errors: Object.fromEntries(exercises.map(e => [e, 0])),
    };
    setPatients(prev => ({ ...prev, [newName.trim()]: newPatient }));
    setSelected(newName.trim());
    setNewName('');
    setNewAge('');
    setNewNotes('');
  };

  const handleDeletePatient = () => {
    if (window.confirm(`Delete "${selected}"?`)) {
      const updated = { ...patients };
      delete updated[selected];
      setPatients(updated);
      const remaining = Object.keys(updated);
      setSelected(remaining[0] || '');
    }
  };

  const handleAddExercise = () => {
    const name = newExercise.trim();
    if (!name || exercises.includes(name)) return;
    setExercises(prev => [...prev, name]);
    const updated = { ...patients };
    Object.keys(updated).forEach(p => {
      updated[p].scores[name] = 0;
      updated[p].errors[name] = 0;
    });
    setPatients(updated);
    setNewExercise('');
  };

  const handleDeleteExercise = (name) => {
    if (!window.confirm(`Delete "${name}" from all patients?`)) return;
    setExercises(prev => prev.filter(e => e !== name));
    const updated = { ...patients };
    Object.keys(updated).forEach(p => {
      delete updated[p].scores[name];
      delete updated[p].errors[name];
    });
    setPatients(updated);
  };

  const correct = exercises.map(ex => patients[selected]?.scores[ex] || 0);
  const errors = exercises.map(ex => patients[selected]?.errors[ex] || 0);
  const totalPoints = correct.reduce((sum, val) => sum + val * 10, 0);
  const maxPoints = 1000;
  const percentage = Math.min((totalPoints / maxPoints) * 100, 100).toFixed(1);

  const data = {
    labels: exercises,
    datasets: [
      { label: 'Correct', data: correct, backgroundColor: '#3B82F6' },
      { label: 'Errors', data: errors, backgroundColor: '#F87171' },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Speech Exercise Accuracy',
        font: { size: 20 },
      },
    },
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2563EB' }}>📈 Progress Tracking</h2>
      <p style={{ marginBottom: '1rem' }}>Visualize your pronunciation accuracy and score growth.</p>

      {/* Patient Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <label>Select Patient:</label>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{
            padding: '0.5rem', borderRadius: '8px',
            border: '1px solid #D1D5DB'
          }}
        >
          {Object.keys(patients).map(name => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <button
          onClick={handleDeletePatient}
          style={{
            background: '#DC2626', color: 'white', border: 'none',
            padding: '0.6rem 1rem', borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🗑️ Delete
        </button>
      </div>

      {/* Profile Info */}
      <div style={{
        background: '#F3F4F6', padding: '1rem', borderRadius: '10px',
        border: '1px solid #E5E7EB', marginBottom: '2rem'
      }}>
        <p><strong>Age:</strong> {patients[selected]?.age}</p>
        <p><strong>Notes:</strong> {patients[selected]?.notes}</p>
      </div>

      {/* Score Editor */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
        padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <h4 style={{
          color: '#1E3A8A', borderBottom: '2px solid #DBEAFE',
          paddingBottom: '0.5rem', marginBottom: '1rem'
        }}>📝 Rate Each Exercise (0–10)</h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1rem'
        }}>
          {exercises.map(ex => (
            <div key={ex}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>{ex}</strong></span>
                <button onClick={() => handleDeleteExercise(ex)} style={{ color: '#9CA3AF', border: 'none', background: 'transparent' }}>🗑️</button>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={patients[selected]?.scores[ex]}
                onChange={e => handleScoreChange(ex, e.target.value)}
                style={{
                  width: '100%', padding: '0.5rem', borderRadius: '8px',
                  border: '1px solid #D1D5DB', textAlign: 'center'
                }}
              />
            </div>
          ))}
        </div>

        {/* Add Exercise */}
        <div style={{ marginTop: '1.5rem' }}>
          <input
            placeholder="New Exercise Name"
            value={newExercise}
            onChange={e => setNewExercise(e.target.value)}
            style={{
              padding: '0.5rem', borderRadius: '8px',
              border: '1px solid #D1D5DB', marginRight: '1rem'
            }}
          />
          <button
            onClick={handleAddExercise}
            style={{
              background: '#2563EB', color: 'white', border: 'none',
              padding: '0.6rem 1rem', borderRadius: '8px',
              fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Add Exercise
          </button>
        </div>
      </div>

      {/* New Patient Form */}
      <h4 style={{ marginBottom: '0.5rem' }}>➕ Add New Patient</h4>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 3fr auto', gap: '1rem',
        marginBottom: '2rem'
      }}>
        <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
        <input placeholder="Age" type="number" value={newAge} onChange={e => setNewAge(e.target.value)} />
        <input placeholder="Notes" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
        <button
          onClick={handleNewPatient}
          style={{
            background: '#2563EB', color: 'white',
            border: 'none', padding: '0.6rem 1rem',
            borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: '#E5E7EB', borderRadius: '1rem', overflow: 'hidden',
        marginBottom: '1rem', height: '20px', width: '100%'
      }}>
        <div style={{
          width: `${percentage}%`,
          background: 'linear-gradient(to right, #FACC15, #2563EB)',
          height: '100%'
        }} />
      </div>
      <p>{totalPoints} / {maxPoints} Points</p>

      {/* Chart */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E5E7EB',
        borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <Bar data={data} options={options} />
      </div>

      <p style={{ marginTop: '2rem', textAlign: 'center' }}>
        Keep practicing to level up your Speech AI mastery! 🗣️
      </p>
    </div>
  );
}
