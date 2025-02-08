import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Lock background scrolling when modal is open.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
  
    if (!isOpen) return null;
  
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto shadow-lg transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    aria-label="Close modal"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};
  
export default Modal;