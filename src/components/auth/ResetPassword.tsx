import { useState } from 'react';
import { RotateCcw, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { auth } from '../../lib/auth';

interface ResetPasswordProps {
  onClose: () => void;
  onSuccess: () => void;
  email: string; // Typically passed from URL token, but for now we'll take it as prop
}

export function ResetPassword({ onClose, onSuccess, email }: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await auth.fetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword: password }),
      });

      if (!res.ok) throw new Error('Failed to reset password');

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard onClose={onClose}>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <RotateCcw className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Create New Password</h2>
        <p className="text-sm text-gray-500 max-w-[280px]">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">New Password</label>
          <div className="relative group">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full pl-6 pr-12 py-4 bg-[#F5F7FF] border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
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

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Confirm New Password</label>
          <div className="relative group">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
              className="w-full pl-6 pr-4 py-4 bg-[#F5F7FF] border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Reset Password'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </AuthCard>
  );
}
