import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = makeId();
      setToasts((current) => [...current, { id, ...toast }]);
      window.setTimeout(() => dismiss(id), 4600);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (title, message) => showToast({ type: 'success', title, message }),
      error: (title, message) => showToast({ type: 'error', title, message }),
      info: (title, message) => showToast({ type: 'info', title, message }),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.98 }}
                className="pointer-events-auto rounded-brand border border-white/70 bg-white/95 p-4 text-husky-cocoa shadow-soft backdrop-blur dark:border-white/10 dark:bg-husky-cocoa/95 dark:text-husky-cream"
              >
                <div className="flex gap-3">
                  <Icon
                    className={
                      toast.type === 'success'
                        ? 'mt-0.5 h-5 w-5 text-husky-mint'
                        : toast.type === 'error'
                          ? 'mt-0.5 h-5 w-5 text-red-500'
                          : 'mt-0.5 h-5 w-5 text-husky-blue'
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{toast.title}</p>
                    {toast.message ? <p className="mt-1 text-sm text-husky-brown/75 dark:text-husky-cream/70">{toast.message}</p> : null}
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-1 text-husky-brown/70 transition hover:bg-husky-beige/30 dark:text-husky-cream/70"
                    aria-label="Fechar aviso"
                    onClick={() => dismiss(toast.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast precisa estar dentro de ToastProvider.');
  return context;
}
