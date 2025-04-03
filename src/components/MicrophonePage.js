import React, { useState } from 'react';
import exercises from './ExerciseData';
import ExerciseSearch from './ExerciseSearch';

const MicrophonePage = () => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <h2>Practice Exercises</h2>
      <ExerciseSearch query={query} setQuery={setQuery} exercises={exercises} />
    </div>
  );
};

export default MicrophonePage;
