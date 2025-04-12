// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1dw2ioup-QcZ1CJbQpaXKXpd65C5knE0",
  authDomain: "aispec-af4c2.firebaseapp.com",
  projectId: "aispec-af4c2",
  storageBucket: "aispec-af4c2.firebasestorage.app",
  messagingSenderId: "584241353741",
  appId: "1:584241353741:web:fdd4a7eba11cabd7587144"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
