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
import { FaTimesCircle } from 'react-icons/fa';

const ProgressTracking = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState([
    { label: 'name', value: '' },
    { label: 'surname', value: '' },
    { label: 'age', value: '' }
  ]);
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
    const patient = newPatient.reduce((obj, field) => ({ ...obj, [field.label]: field.value }), {});
    setPatients([...patients, patient]);
    setNewPatient([
      { label: 'name', value: '' },
      { label: 'surname', value: '' },
      { label: 'age', value: '' }
    ]);
  };

  const handleDeletePatient = () => {
    setPatients(patients.filter(p => p.name !== selectedPatient.name));
    setSelectedPatient(null);
  };

  const handleAddPatientField = () => {
    setNewPatient([...newPatient, { label: '', value: '' }]);
  };

  const handleRemovePatientField = (index) => {
    const updated = [...newPatient];
    updated.splice(index, 1);
    setNewPatient(updated);
  };

  const handlePatientFieldChange = (index, key, value) => {
    const updated = [...newPatient];
    updated[index][key] = value;
    setNewPatient(updated);
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

  const handleDownloadPDF = () => {
    if (!selectedPatient) return;
    const text = [
      'Patient Progress Report:',
      ...Object.entries(selectedPatient).map(([key, value]) => `${key}: ${value}`),
      '',
      'Exercise Scores:',
      ...exercises.map(ex => `${ex.label}: ${ex.score}`)
    ].join('\n');

    const blob = new Blob([text], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPatient.name}_progress.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f0f6ff] min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">📈 Progress Tracking</h1>
        <p className="text-gray-600">Visualize your pronunciation accuracy and score growth.</p>
      </div>

      <div className="flex items-center space-x-4">
        <select onChange={handlePatientChange} className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm">
          <option>Select Patient</option>
          {patients.map((p, idx) => (
            <option key={idx}>{p.name}</option>
          ))}
        </select>
        <button onClick={handleDeletePatient} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm">Delete Patient</button>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
        <h2 className="font-semibold mb-2 text-gray-700">Add New Patient</h2>
        <div className="space-y-3">
          {newPatient.map((field, index) => (
            <div key={index} className="flex justify-center space-x-2">
              <input
                placeholder="Field"
                value={field.label}
                onChange={(e) => handlePatientFieldChange(index, 'label', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Value"
                value={field.value}
                onChange={(e) => handlePatientFieldChange(index, 'value', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <button onClick={() => handleRemovePatientField(index)} className="text-red-500 hover:text-red-700 text-xl">
                <FaTimesCircle />
              </button>
            </div>
          ))}
          <div className="flex justify-center space-x-2">
            <button onClick={handleAddPatientField} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg shadow-sm">+ Field</button>
            <button onClick={handleAddPatient} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm">Add Patient</button>
          </div>
        </div>
      </div>

      {selectedPatient && (
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          {Object.entries(selectedPatient).map(([key, value], i) => (
            <p key={i}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
      )}

      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-4 text-gray-700">Rate Each Exercise (0–10)</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {exercises.map((ex, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <label className="font-semibold text-gray-800">{ex.label}</label>
              <input
                type="number"
                min="0"
                max="10"
                value={ex.score}
                onChange={e => handleExerciseChange(idx, e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 w-16 text-center"
              />
              <button onClick={() => handleDeleteExercise(idx)} className="text-red-500 text-xl hover:scale-110 transition-transform">❌</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-2 justify-center">
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="New Exercise Name"
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <button onClick={handleAddExercise} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm">Add</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-2 text-gray-700">Points & Chart</h2>
        <p className="mb-4">{totalPoints} / 1000 Points</p>
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

      <div className="flex justify-center pt-6">
        <button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-medium shadow">
          📥 Save Report
        </button>
      </div>
    </div>
  );
};

export default ProgressTracking;
