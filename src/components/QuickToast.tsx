'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface QuickToastProps {
  message: string | null;
}

export const QuickToast: React.FC<QuickToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-2 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl font-semibold text-xs sm:text-sm animate-in slide-in-from-bottom-5 duration-300">
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

