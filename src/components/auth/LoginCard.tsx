import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { auth } from '../../lib/auth';

interface LoginCardProps {
  onClose: () => void;
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
  onSuccess: (user: any) => void;
}

export function LoginCard({ onClose, onSignUpClick, onForgotPasswordClick, onSuccess }: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await auth.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      auth.setToken(data.token);
      auth.setUser(data.user);
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      onClose={onClose} 
      title="Login to quanlythuchi" 
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
            Email or Username
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-start">
          <button 
            type="button"
            onClick={onForgotPasswordClick}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
            <span className="bg-white px-4 text-gray-300">Or continue with</span>
          </div>
        </div>

        <button 
          type="button"
          className="w-full py-4 px-6 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all group shadow-sm active:scale-[0.98]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
          <span className="text-sm font-bold text-gray-600">Google</span>
        </button>

        <div className="pt-4 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? {' '}
            <button 
              type="button"
              onClick={onSignUpClick}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthCard>
  );
}
