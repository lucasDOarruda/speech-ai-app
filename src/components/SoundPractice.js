import React from 'react';

const SoundPractice = () => {
  const handlePractice = (sound) => {
    alert(`Practicing the "${sound}" sound`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800">Pronounce the "S" Sound</h3>
        <p className="text-gray-600">"Snake", "Sun", "Smile"</p>
        <button
          onClick={() => handlePractice("S")}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Practice "S"
        </button>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">Pronounce the "R" Sound</h3>
        <p className="text-gray-600">"Rabbit", "Red", "Round"</p>
        <button
          onClick={() => handlePractice("R")}
          className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Practice "R"
        </button>
      </div>
    </div>
  );
};

export default SoundPractice;
