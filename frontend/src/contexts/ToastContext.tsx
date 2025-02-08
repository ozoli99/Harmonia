import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "info";
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: "success" | "error" | "info") => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast: ToastContextType["addToast"] = (message, type?) => {
        const resolvedType: "success" | "error" | "info" = type ?? "info";
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type: resolvedType }]);
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
      );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
  };