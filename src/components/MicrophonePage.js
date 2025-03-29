import React, { useState } from 'react';

const exercises = [
  { id: 1, title: 'S Sound Practice', description: 'Practice words with the "S" sound like "Snake", "Sun", "Smile".' },
  { id: 2, title: 'R Sound Practice', description: 'Practice the tricky "R" sound using words like "Rabbit", "Red", "Round".' },
  { id: 3, title: 'Tongue Strengthening', description: 'Improve tongue mobility with up/down and side-to-side stretches.' },
  { id: 4, title: 'Lip Closure Drill', description: 'Enhance lip strength and closure using bilabial sounds: "Pa", "Ba", "Ma".' },
  { id: 5, title: 'Breath Support Training', description: 'Control airflow during speech with breathing exercises and sustained vowels.' },
  { id: 6, title: 'Ch Sound Practice', description: 'Target "Ch" sounds with words like "Chair", "Cheese", "Chalk".' },
  { id: 7, title: 'Th Sound Clarity', description: 'Differentiate between voiced/unvoiced "Th" in "This" vs "Think".' },
  { id: 8, title: 'Z Sound Emphasis', description: 'Use words like "Zebra", "Zoom", "Buzz" to work on the "Z" sound.' },
  { id: 9, title: 'Sentence Repetition', description: 'Repeat structured sentences to build fluency and articulation.' },
  { id: 10, title: 'Minimal Pairs Drill', description: 'Practice pairs like "bat" vs "pat", "cap" vs "cab" for clarity.' },
];

const MicrophonePage = () => {
  const [query, setQuery] = useState('');

  const filteredExercises = exercises.filter(ex =>
    ex.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">🎙 Microphone Input</h3>
          <p className="text-gray-600">
            Speak directly to the browser and get instant transcription.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-4">Speech Exercises</h2>
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full px-4 py-2 rounded-lg border shadow-sm focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredExercises.map((ex) => (
            <div key={ex.id} className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">{ex.title}</h3>
              <p className="text-gray-600">{ex.description}</p>
            </div>
          ))}
          {filteredExercises.length === 0 && (
            <p className="text-center text-gray-500 col-span-2">No exercises found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicrophonePage;
