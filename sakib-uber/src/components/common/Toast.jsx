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
          className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all dark:bg-white dark:text-neutral-900 animate-in fade-in slide-in-from-bottom-3"
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} className="text-red-400 dark:text-red-600" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
