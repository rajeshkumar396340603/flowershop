import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="px-4 py-2 rounded-full bg-[#012d1d] text-white font-sans text-[12px] font-semibold shadow-2xl flex items-center gap-2 border border-white/10">
        <span className="material-symbols-outlined text-[18px] text-[#fc9174] material-symbols-filled">
          check_circle
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};
