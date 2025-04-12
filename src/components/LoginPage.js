import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [role, setRole] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert('User not found in database.');
        return;
      }

      const userData = userSnap.data();
      if (userData.role !== role.toLowerCase()) {
        alert(`Incorrect role. This is a ${role}-only login page.`);
        return;
      }

      if (role === 'therapist') {
        navigate('/therapist-dashboard');
      } else {
        navigate('/client-dashboard');
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">🔐 Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Login as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            >
              <option value="client">Client</option>
              <option value="therapist">Therapist</option>
            </select>
          </div>

          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <a href="/speech-ai-app/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
