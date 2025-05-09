import React from "react";

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: {
        id: number;
        amount: string;
        date: string;
        status: string;
        method: string;
    } | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
    isOpen,
    onClose,
    payment,
}) => {
    if (!isOpen || !payment) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Payment Receipt
                </h2>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                        <strong>Payment ID:</strong> #{payment.id}
                    </p>
                    <p>
                        <strong>Amount:</strong> {payment.amount}
                    </p>
                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(payment.date).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Status:</strong> {payment.status}
                    </p>
                    <p>
                        <strong>Method:</strong> {payment.method}
                    </p>
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#CFA15D] text-white rounded hover:bg-[#b78842] transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
