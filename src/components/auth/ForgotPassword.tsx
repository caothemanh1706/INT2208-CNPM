import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { auth } from '../../lib/auth';

interface ForgotPasswordProps {
  onClose: () => void;
  onBackToLogin: () => void;
  onResetPassword: (email: string) => void;
}

export function ForgotPassword({ onClose, onBackToLogin, onResetPassword }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await auth.fetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send reset link');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthCard onClose={onClose}>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Check your inbox!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[280px]">
            We've sent a recovery link to your email address. Please follow the instructions to set a new password.
          </p>
          <button
            onClick={() => onResetPassword(email)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 mb-4"
          >
            Create New Password
          </button>
          <button 
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      onClose={onClose} 
      title="Reset your password" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
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

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="text-center">
          <button 
            type="button"
            onClick={onBackToLogin}
            className="flex items-center justify-center gap-2 w-full text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
