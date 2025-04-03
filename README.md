# Speech Pathology App

A React-based web application to support speech therapy exercises. This app allows users to practice sounds, interact with an AI for feedback, track their progress, and browse educational content. Designed with a user-friendly interface and speech recognition features to support learning and development.

## 🌟 Features

- 🎙️ **Microphone Support**: Capture and analyze speech for feedback.
- 🧠 **AI Interaction**: Chatbot that guides users and gives correction suggestions.
- 🏋️ **Practice Exercises**: A range of speech exercises for sound repetition and accuracy.
- 📊 **Progress Tracking**: Visual feedback with score ladders and charts to monitor improvement.
- 🧭 **Simple Navigation**: Pages for Home, About, Contact, and Exercises.
- 💡 **Friendly UI**: Clean and approachable design with blue and yellow tones.

## 📁 Project Structure

```
src/
├── App.js                # Main application component
├── index.js              # Entry point for the React app
├── index.css             # Global styles
└── components/
    ├── Navbar.js             # Top navigation bar
    ├── Home.js               # Home landing page
    ├── About.js              # About the app
    ├── Contact.js            # Contact form/page
    ├── ExercisesPage.js      # Overview of exercises
    ├── PracticeExercise.js   # Individual exercise logic
    ├── SoundPractice.js      # Practice component for sound repetition
    ├── MicrophonePage.js     # Handles microphone input and voice capture
    ├── AIInteraction.js      # AI chat and feedback interaction
    └── ProgressTracking.js   # Displays score, charts, and progress ladder
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm or yarn

### Installation

```bash
npm install
```

### Run the App

```bash
npm start
```

The app will start in development mode and can be viewed at `http://localhost:3000`.

## 🛠️ Built With

- **React** – Frontend UI framework
- **Chart.js** – For progress visualization
- **Web Speech API / SpeechRecognition** – For voice input and analysis

## 📌 Future Improvements

- User login and personalized tracking
- Backend integration to store results
- More diverse exercises
- Mobile optimization

## 🧑‍💻 Author

Developed by [Your Name] – Tech consulting and app development by [Yadata](https://yourwebsite.com)
