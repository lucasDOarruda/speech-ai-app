import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ Tailwind styles
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const base =
  process.env.NODE_ENV === 'production' ? '/speech-ai-app' : '/';

root.render(
  <BrowserRouter basename={base}>
    <App />
  </BrowserRouter>
);
