import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await toast.promise(
        login({ email, password }),
        {
          loading: 'Signing in...',
          success: 'Successfully logged in!',
          error: (err) => err.response?.data?.message || 'Login failed. Provide valid credentials.'
        }
      );
      navigate('/dashboard');
    } catch (err) {
      // Handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email first to reset your password.");
      return;
    }
    
    try {
      await toast.promise(
        api.post('/auth/forgotPassword', { email }),
        {
          loading: 'Sending reset link...',
          success: 'Password reset link sent to your email!',
          error: (err) => err.response?.data?.message || 'Failed to send reset link.'
        }
      );
    } catch (err) {
      // Handled by toast.promise
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-900 border-t-4 border-emerald-500">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SmartPost <span className="text-emerald-500">AI</span></h1>
          <p className="text-slate-400">Welcome back! Sign in to continue testing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5 align-middle">
              <label className="block text-slate-300 text-sm font-medium">Password</label>
              <a href="#" onClick={handleForgotPassword} className="text-xs text-emerald-500 hover:text-emerald-400 focus:outline-none">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center mt-2 disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-md shadow-emerald-500/20"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account? <Link to="/register" className="text-emerald-500 font-medium hover:text-emerald-400 ml-1">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
