import React, { useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaTimesCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProgressTracking = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState([
    { label: 'name', value: '' },
    { label: 'surname', value: '' },
    { label: 'age', value: '' }
  ]);
  const [exercises, setExercises] = useState([
    { label: 'S', score: 0 }, { label: 'R', score: 0 },
    { label: 'Ch', score: 0 }, { label: 'Z', score: 0 },
    { label: 'Th', score: 0 }, { label: 'Minimal', score: 0 },
    { label: 'Sentence', score: 0 }
  ]);
  const [newExercise, setNewExercise] = useState('');
  const chartRef = useRef(null);

  const totalPoints = exercises.reduce((sum, ex) => sum + Number(ex.score), 0);

  const handleAddPatient = () => {
    const filled = newPatient.every(field => field.value.trim() !== '');
    if (filled) {
      const patient = Object.fromEntries(newPatient.map(f => [f.label, f.value]));
      setPatients([...patients, patient]);
      setNewPatient(newPatient.map(f => ({ ...f, value: '' })));
    }
  };

  const handleDeletePatient = () => {
    setPatients(patients.filter((_, idx) => idx !== selectedPatient));
    setSelectedPatient(null);
  };

  const handleExportPDF = async () => {
    const input = chartRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.text('Speech Progress Report', 10, 10);
    pdf.addImage(imgData, 'PNG', 10, 20, 180, 100);
    pdf.save('progress-report.pdf');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white shadow-xl p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">📌 Add New Patient</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {newPatient.map((field, idx) => (
            <input key={idx} type="text" placeholder={field.label} value={field.value}
              onChange={e => {
                const updated = [...newPatient];
                updated[idx].value = e.target.value;
                setNewPatient(updated);
              }}
              className="border rounded p-2 w-full" />
          ))}
        </div>
        <button onClick={handleAddPatient} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Patient</button>
        <select
          className="mt-4 block w-full border p-2 rounded"
          onChange={e => setSelectedPatient(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select Patient</option>
          {patients.map((p, i) => (
            <option key={i} value={i}>{p.name} {p.surname}</option>
          ))}
        </select>
        {selectedPatient !== null && <button onClick={handleDeletePatient} className="mt-2 text-red-500">Delete Patient</button>}
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">🧠 Rate Exercises</h2>
        <div className="flex flex-wrap gap-4 overflow-x-auto">
          {exercises.map((ex, idx) => (
            <div key={idx} className="min-w-[120px] p-4 bg-white shadow rounded-lg">
              <h4 className="font-bold mb-2">{ex.label}</h4>
              <input
                type="number"
                value={ex.score}
                onChange={e => {
                  const updated = [...exercises];
                  updated[idx].score = Number(e.target.value);
                  setExercises(updated);
                }}
                className="w-full border p-1 rounded text-center"
                min={0} max={10}
              />
              <button onClick={() => setExercises(exercises.filter((_, i) => i !== idx))} className="text-red-500 mt-2 text-sm">Remove</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="New Exercise Name"
            value={newExercise}
            onChange={e => setNewExercise(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={() => {
              if (newExercise.trim()) {
                setExercises([...exercises, { label: newExercise, score: 0 }]);
                setNewExercise('');
              }
            }}
            className="bg-blue-500 text-white px-4 rounded"
          >Add</button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-4" ref={chartRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">📊 Progress Chart ({totalPoints} / 1000 Points)</h2>
          <button onClick={handleExportPDF} className="bg-purple-500 text-white px-4 py-1 rounded">Export PDF</button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={exercises}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressTracking;