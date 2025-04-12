import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExercisesPage = () => {
  const navigate = useNavigate();
  const [customExercises, setCustomExercises] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', videoUrl: '', file: null });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customExercises')) || [];
    setCustomExercises(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const fileUrl = URL.createObjectURL(files[0]);
      setForm({ ...form, videoUrl: fileUrl, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddExercise = () => {
    if (!form.title || !form.description || !form.videoUrl) return;

    const newExercise = {
      ...form,
      id: Date.now(),
      gptFeedback: `Let's practice the sound in: ${form.title}. Remember, focus on clarity!`,
      targetWords: form.description.split(/[\s,]+/)
    };

    const updated = [...customExercises, newExercise];
    setCustomExercises(updated);
    localStorage.setItem('customExercises', JSON.stringify(updated));
    setForm({ title: '', description: '', videoUrl: '', file: null });
  };

  const handleDeleteExercise = (id) => {
    const updated = customExercises.filter(ex => ex.id !== id);
    setCustomExercises(updated);
    localStorage.setItem('customExercises', JSON.stringify(updated));
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

  const sSoundExercise = {
    id: 1,
    title: 'S Sound Practice',
    description: 'Practice words with the "S" sound like "Snake", "Sun", "Smile".',
    videoUrl: '/videos/s-sound-demo.mp4'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Speech Exercises</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form on the Left */}
        <div className="md:col-span-1">
          <div className="p-6 bg-white rounded-xl border shadow space-y-4">
            <h3 className="text-lg font-semibold text-blue-700">Add New Custom Exercise</h3>
            <input
              name="title"
              placeholder="Exercise Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Exercise Description (use target words here)"
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
            {form.videoUrl && (
              <div className="mt-4">
                {form.videoUrl.includes('youtube.com') || form.videoUrl.includes('youtu.be') ? (
                  <iframe
                    width="100%"
                    height="240"
                    src={formatYouTubeUrl(form.videoUrl)}
                    title="Live preview"
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-xl"
                  />
                ) : (
                  <video src={form.videoUrl} controls className="w-full rounded-xl">
                    Video preview not supported.
                  </video>
                )}
              </div>
            )}
            <button
              onClick={handleAddExercise}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Exercise
            </button>
          </div>
        </div>

        {/* Exercises on the Right */}
        <div className="md:col-span-2 space-y-6">
          {/* Default S Sound Practice Card */}
          <div
            className="cursor-pointer p-6 rounded-xl bg-gradient-to-br from-yellow-100 to-blue-100 shadow hover:shadow-md transition"
            onClick={() => navigate(`/exercise/${sSoundExercise.id}`)}
          >
            <h2 className="text-xl font-semibold text-blue-800">{sSoundExercise.title}</h2>
            <p className="text-gray-700 mt-1">{sSoundExercise.description}</p>
          </div>

          {/* Custom Exercises */}
          {customExercises.map((ex) => (
            <div
              key={ex.id}
              className="p-6 rounded-xl bg-gradient-to-br from-yellow-100 to-blue-100 shadow hover:shadow-md transition relative"
            >
              <div onClick={() => navigate(`/exercise/${ex.id}`)} className="cursor-pointer">
                <h2 className="text-xl font-semibold text-blue-800">{ex.title}</h2>
                <p className="text-gray-700 mt-1">{ex.description}</p>
              </div>
              <button
                onClick={() => handleDeleteExercise(ex.id)}
                className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded"
              >
                ✕ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
