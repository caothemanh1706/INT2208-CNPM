import { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { auth } from '../../lib/auth';

interface SignUpCardProps {
  onClose: () => void;
  onLoginClick: () => void;
  onSuccess: (user: any) => void;
}

export function SignUpCard({ onClose, onLoginClick, onSuccess }: SignUpCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agree) {
      setError('Please agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const res = await auth.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

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
      title="Create your account" 
      subtitle="Secure your financial future with quanlythuchi"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <button 
          type="button"
          className="w-full py-4 px-6 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all group shadow-sm bg-[#F5F7FF]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-bold text-[#1A1A1A]">Continue with Google</span>
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-bold">
            <span className="bg-white px-4 text-gray-300">Or email</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Username</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
              className="w-full pl-12 pr-4 py-4 bg-[#F5F7FF] border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Gmail / Email</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full pl-12 pr-4 py-4 bg-[#F5F7FF] border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
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
              className="w-full pl-12 pr-4 py-4 bg-[#F5F7FF] border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-12 pr-4 py-4 bg-[#F5F7FF] border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <input 
            type="checkbox" 
            id="agree" 
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" 
          />
          <label htmlFor="agree" className="text-xs text-gray-500">
            I agree to the <button type="button" className="text-blue-600 font-bold hover:underline">Terms</button> and <button type="button" className="text-blue-600 font-bold hover:underline">Privacy Policy</button>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-[10px] rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="pt-2 text-center">
          <p className="text-xs text-gray-500">
            Already have an account? {' '}
            <button 
              type="button"
              onClick={onLoginClick}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
