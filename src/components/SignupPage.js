import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [role, setRole] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        role
      });

      navigate(`/${role}-dashboard`);
    } catch (err) {
      alert('Signup error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <form onSubmit={handleSignup} className="bg-white shadow-lg p-8 rounded-2xl max-w-sm w-full">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-600">🧠 Create Account</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Register as</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 mb-4 border rounded">
          <option value="client">Client</option>
          <option value="therapist">Therapist</option>
        </select>

        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <p className="text-sm text-center mt-4">Already registered? <a href="/login" className="text-blue-500 underline">Login</a></p>
      </form>
    </div>
  );
};

export default SignupPage;