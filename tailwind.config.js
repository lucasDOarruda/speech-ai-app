// tailwind.config.js

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Blue-600
        accent: '#facc15',  // Yellow-400
        light: '#f9fafb',   // Light background
      },
      animation: {
        'bounce-once': 'bounce 0.4s ease', // 👈 This adds our custom bounce-once class
      },
    },
  },
  plugins: [],
};
