// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Replace these if needed from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC1dw2ioup-QcZ1CJbQpaXKXpd65C5knE0",
  authDomain: "aispec-af4c2.firebaseapp.com",
  projectId: "aispec-af4c2",
  storageBucket: "aispec-af4c2.firebasestorage.app",
  messagingSenderId: "584241353741",
  appId: "1:584241353741:web:fdd4a7eba11cabd7587144"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth + 🔥 Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app);
