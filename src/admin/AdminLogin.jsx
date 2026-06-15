import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaUserShield } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const isAuth = sessionStorage.getItem('payana_admin_auth');
    if (isAuth === 'true') {
      navigate('/payanaoverseas/payanaadmin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'PayanaAdmin2026';

    setTimeout(() => {
      if (username === envUsername && password === envPassword) {
        sessionStorage.setItem('payana_admin_auth', 'true');
        // Redirect to dashboard
        navigate('/payanaoverseas/payanaadmin/dashboard');
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 800); // Add a small delay for a native feel
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-2">
            <FaUserShield size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Portal
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to manage your site
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pt-2">
          &copy; {new Date().getFullYear()} Payana Overseas. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
