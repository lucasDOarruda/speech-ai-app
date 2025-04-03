import React from 'react';

const ExerciseSearch = ({ query, setQuery, exercises }) => {
  const filtered = exercises.filter(ex =>
    ex.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search exercises..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filtered.map((exercise) => (
          <li key={exercise.id}>
            <strong>{exercise.title}</strong>: {exercise.description}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExerciseSearch;
