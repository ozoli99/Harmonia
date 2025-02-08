import React from 'react';
import { useToast } from '../contexts/ToastContext';

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();
    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded shadow-md text-white transition-colors 
                        ${toast.type === 'success' ? 'bg-green-500' : ''}
                        ${toast.type === 'error' ? 'bg-red-500' : ''}
                        ${toast.type === 'info' ? 'bg-blue-500' : ''}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};
  
export default ToastContainer;