import React from 'react';
import { X } from 'lucide-react';

interface AuthCardProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthCard({ children, onClose, title, subtitle }: AuthCardProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pt-12">
          {title && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
