import React from "react";
import { useToast } from "@shared/contexts/ToastContext";

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();
    return (
        <div className="fixed top-4 right-4 space-y-3 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg text-white transition-all transform 
                        ${toast.type === "success" ? "bg-green-500" : ""}
                        ${toast.type === "error" ? "bg-red-500" : ""}
                        ${toast.type === "info" ? "bg-blue-500" : ""}
                        hover:scale-105`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
