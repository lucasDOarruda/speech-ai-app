import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

const ExercisesPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [assignedExercises, setAssignedExercises] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    file: null,
  });

  // Fetch all clients from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'client'));
      const snapshot = await getDocs(q);
      const clientList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientList);
    };
    fetchClients();
  }, []);

  // Listen to assigned exercises for the selected client
  useEffect(() => {
    if (!selectedClient) return;

    const ref = collection(db, 'users', selectedClient, 'assignedExercises');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignedExercises(data);
    });

    return unsubscribe;
  }, [selectedClient]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const fileUrl = URL.createObjectURL(files[0]);
      setForm({ ...form, videoUrl: fileUrl, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAssign = async () => {
    if (!selectedClient || !form.title || !form.description || !form.videoUrl) return;

    const newExercise = {
      ...form,
      createdAt: new Date(),
      gptFeedback: `Let's practice the sound in: ${form.title}. Focus on clear pronunciation.`,
      targetWords: form.description.split(/[\s,]+/),
    };

    await addDoc(collection(db, 'users', selectedClient, 'assignedExercises'), newExercise);
    setForm({ title: '', description: '', videoUrl: '', file: null });
  };

  const handleDelete = async (exerciseId) => {
    if (!selectedClient) return;
    await deleteDoc(doc(db, 'users', selectedClient, 'assignedExercises', exerciseId));
  };

  const formatYouTubeUrl = (url) => {
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Assign Speech Exercise</h1>

      <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold text-blue-700">Add New Custom Exercise</h2>

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.email}
            </option>
          ))}
        </select>

        <input
          name="title"
          placeholder="Exercise Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Exercise Description (use target words)"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="videoUrl"
          placeholder="Video URL (YouTube or mp4)"
          value={form.videoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="file"
          type="file"
          accept="video/mp4"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleAssign}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign Exercise
        </button>
      </div>

      {/* 🧠 Assigned Exercise List */}
      {selectedClient && (
        <div className="max-w-5xl mx-auto mt-10 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Assigned Exercises</h2>

          {assignedExercises.length === 0 ? (
            <p className="text-gray-500 text-center">No exercises assigned to this client yet.</p>
          ) : (
            assignedExercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-white shadow-md p-6 rounded-xl border relative space-y-2"
              >
                <h3 className="text-lg font-semibold text-blue-700">{ex.title}</h3>
                <p className="text-gray-700">{ex.description}</p>

                {ex.videoUrl && (
                  <div className="mt-2">
                    {ex.videoUrl.includes('youtube.com') || ex.videoUrl.includes('youtu.be') ? (
                      <iframe
                        width="100%"
                        height="240"
                        src={formatYouTubeUrl(ex.videoUrl)}
                        title={ex.title}
                        allowFullScreen
                        className="rounded-xl"
                      />
                    ) : (
                      <video src={ex.videoUrl} controls className="w-full rounded-xl" />
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleDelete(ex.id)}
                  className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700 border border-red-300 px-3 py-1 rounded"
                >
                  ✕ Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
