import React from 'react';

interface AppointmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: {
        provider: string;
        customer: string;
        time: string;
        notes?: string;
    } | null;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ isOpen, onClose, appointment }) => {
    if (!appointment) return null;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-auto shadow-2xl transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    aria-label="Close"
                >
                    ×
                </button>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Appointment Details</h3>
                <p className="text-gray-700 dark:text-gray-300"><strong>Provider:</strong> {appointment.provider}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Customer:</strong> {appointment.customer}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Time:</strong> {appointment.time}</p>
                {appointment.notes && <p className="text-gray-700 dark:text-gray-300 mt-4"><strong>Notes:</strong> {appointment.notes}</p>}
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;