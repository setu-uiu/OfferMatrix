import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all border border-emerald-700/60 dark:bg-white dark:text-emerald-950 animate-in fade-in slide-in-from-bottom-3"
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} className="text-rose-400 dark:text-rose-600" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
