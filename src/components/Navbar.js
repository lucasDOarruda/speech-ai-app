import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate(-1);

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {location.pathname !== '/' && (
          <button onClick={goBack} className="text-gray-700 hover:text-blue-600">
            <ArrowLeft size={20} />
          </button>
        )}
        <span
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          🧠 Speech AI
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <button onClick={() => navigate('/')} className="text-gray-700 hover:text-blue-600">
          Home
        </button>
        <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-blue-600">
          Contact
        </button>
        
      </div>
    </nav>
  );
};

export default Navbar;
