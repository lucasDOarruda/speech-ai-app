import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ProgressTracking = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', notes: '' });
  const [exercises, setExercises] = useState([
    { label: 'S', score: 0 },
    { label: 'R', score: 0 },
    { label: 'Ch', score: 0 },
    { label: 'Z', score: 0 },
    { label: 'Th', score: 0 },
    { label: 'Minimal', score: 0 },
    { label: 'Sentence', score: 0 },
  ]);
  const [newExercise, setNewExercise] = useState('');

  const totalPoints = exercises.reduce((sum, ex) => sum + Number(ex.score), 0);

  const handlePatientChange = (e) => {
    const selected = patients.find(p => p.name === e.target.value);
    setSelectedPatient(selected);
  };

  const handleAddPatient = () => {
    setPatients([...patients, newPatient]);
    setNewPatient({ name: '', age: '', notes: '' });
  };

  const handleDeletePatient = () => {
    setPatients(patients.filter(p => p.name !== selectedPatient.name));
    setSelectedPatient(null);
  };

  const handleExerciseChange = (index, value) => {
    const updated = [...exercises];
    updated[index].score = value;
    setExercises(updated);
  };

  const handleAddExercise = () => {
    if (newExercise.trim()) {
      setExercises([...exercises, { label: newExercise.trim(), score: 0 }]);
      setNewExercise('');
    }
  };

  const handleDeleteExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📈 Progress Tracking</h1>
        <p className="text-gray-600">Visualize your pronunciation accuracy and score growth.</p>
      </div>

      <div className="flex items-center space-x-4">
        <select onChange={handlePatientChange} className="border px-2 py-1">
          <option>Select Patient</option>
          {patients.map((p, idx) => (
            <option key={idx}>{p.name}</option>
          ))}
        </select>
        <button onClick={handleDeletePatient} className="bg-red-500 text-white px-3 py-1 rounded">Delete Patient</button>
      </div>

      {selectedPatient && (
        <div className="border p-4 rounded">
          <p><strong>Age:</strong> {selectedPatient.age}</p>
          <p><strong>Notes:</strong> {selectedPatient.notes}</p>
        </div>
      )}

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-4">Rate Each Exercise (0–10)</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {exercises.map((ex, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <label className="font-semibold">{ex.label}</label>
              <input
                type="number"
                min="0"
                max="10"
                value={ex.score}
                onChange={e => handleExerciseChange(idx, e.target.value)}
                className="border px-2 py-1 w-16 text-center"
              />
              <button onClick={() => handleDeleteExercise(idx)} className="text-red-500 text-xl">❌</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-2 justify-center">
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="New Exercise Name"
            className="border px-2 py-1"
          />
          <button onClick={handleAddExercise} className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Add New Patient</h2>
        <div className="flex space-x-2">
          <input
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            className="border px-2 py-1"
          />
          <input
            placeholder="Age"
            type="number"
            value={newPatient.age}
            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
            className="border px-2 py-1"
          />
          <input
            placeholder="Notes"
            value={newPatient.notes}
            onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
            className="border px-2 py-1"
          />
          <button onClick={handleAddPatient} className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Points & Chart</h2>
        <p>{totalPoints} / 1000 Points</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={exercises} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressTracking;
