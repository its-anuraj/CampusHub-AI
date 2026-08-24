'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };
  addToast: (options: ToastOptions | ((type: ToastType, message: string, title?: string, duration?: number) => void)) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerToast = useCallback((type: ToastType, message: string, title?: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const addToast = useCallback((options: any) => {
    if (typeof options === 'object' && options !== null) {
      triggerToast(options.type || 'info', options.message || '', options.title, options.duration || 4000);
    }
  }, [triggerToast]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message: string, title?: string, duration?: number) => triggerToast('success', message, title, duration),
    error: (message: string, title?: string, duration?: number) => triggerToast('error', message, title, duration),
    warning: (message: string, title?: string, duration?: number) => triggerToast('warning', message, title, duration),
    info: (message: string, title?: string, duration?: number) => triggerToast('info', message, title, duration),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, dismiss }}>
      {children}
      {/* Floating Glassmorphic Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-slide-up ${
              t.type === 'success'
                ? 'bg-white/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10'
                : t.type === 'error'
                ? 'bg-white/95 border-rose-200 text-rose-950 shadow-rose-500/10'
                : t.type === 'warning'
                ? 'bg-white/95 border-amber-200 text-amber-950 shadow-amber-500/10'
                : 'bg-white/95 border-blue-200 text-blue-950 shadow-blue-500/10'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <h5 className="text-xs font-semibold text-slate-900 leading-tight mb-0.5">{t.title}</h5>}
              <p className="text-xs text-slate-700 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
