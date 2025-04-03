# 🧠 Speech AI App

An interactive speech therapy assistant powered by OpenAI and browser-based speech recognition.

## 🚀 Live Demo

- Frontend (GitHub Pages): https://lucasdoarruda.github.io/speech-ai-app/
- Backend (Render): https://speech-ai-app-backend.onrender.com

## 🧩 Features

- 🎙️ Real-time speech recognition (via Web Speech API)
- 🤖 AI feedback using OpenAI's GPT (deployed on Render)
- 📄 Therapist transcription logging and session saving
- 🔍 Searchable session history with download option

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS + GitHub Pages
- **Backend**: Node.js + Express + OpenAI API
- **Deployment**: GitHub Pages (frontend) + Render (backend)

## 🧪 How to Test

1. Open the [live frontend](https://lucasdoarruda.github.io/speech-ai-app/)
2. Use microphone permissions in your browser
3. Try any exercise and receive real-time AI feedback!

## 📦 Project Structure

```
/src
  /components
    PracticeExercise.js   # AI pronunciation evaluator
    TranscribePage.js     # Therapist session logger
  App.js, index.js        # Main app logic
/backend (separate repo)
  index.js                # Express server with OpenAI API
```

## 🧠 Future Ideas

- ✅ Save session to Firebase or Supabase
- ✅ Auto-detect user role (patient/therapist)
- ⏳ Export sessions as PDF
- ⏳ AI suggestions for therapy based on session history
- ⏳ Mobile-first design improvements

## 👨‍💻 Author

Made with ❤️ by Lucas A.