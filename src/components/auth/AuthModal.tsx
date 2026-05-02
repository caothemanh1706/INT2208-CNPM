import { useState } from 'react';
import { LoginCard } from './LoginCard';
import { SignUpCard } from './SignUpCard';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialView?: AuthView;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [resetEmail, setResetEmail] = useState('');

  if (!isOpen) return null;

  const handleLoginSuccess = (user: any) => {
    onSuccess(user);
    onClose();
  };

  const handleResetPassword = (email: string) => {
    setResetEmail(email);
    setView('reset-password');
  };

  return (
    <>
      {view === 'login' && (
        <LoginCard 
          onClose={onClose} 
          onSignUpClick={() => setView('signup')}
          onForgotPasswordClick={() => setView('forgot-password')}
          onSuccess={handleLoginSuccess}
        />
      )}
      {view === 'signup' && (
        <SignUpCard 
          onClose={onClose} 
          onLoginClick={() => setView('login')}
          onSuccess={handleLoginSuccess}
        />
      )}
      {view === 'forgot-password' && (
        <ForgotPassword 
          onClose={onClose} 
          onBackToLogin={() => setView('login')}
          onResetPassword={handleResetPassword}
        />
      )}
      {view === 'reset-password' && (
        <ResetPassword 
          onClose={onClose} 
          onSuccess={() => setView('login')}
          email={resetEmail}
        />
      )}
    </>
  );
}
