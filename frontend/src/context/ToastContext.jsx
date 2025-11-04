import React, { createContext, useContext, useState, useCallback } from "react";

// Simple Toast notification system using React Context
const ToastContext = createContext();

// Hook for easy toast usage inside components
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Adds a new toast message and removes it after timeout
  const push = useCallback((msg, type = "success", timeout = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, timeout);
  }, []);

  const value = { push };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toast messages */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}