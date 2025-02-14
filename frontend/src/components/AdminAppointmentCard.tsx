import React from "react";
import { motion } from "framer-motion";
import {
    CalendarIcon,
    UserIcon,
    ClockIcon,
    CheckCircleIcon,
    ClockIcon as PendingIcon,
    XCircleIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";

export interface Appointment {
    id: number;
    provider: string;
    customer: string;
    formattedTime: string;
    status: "confirmed" | "pending" | "cancelled";
    notes?: string;
}

interface AdminAppointmentCardProps {
    appointment: Appointment;
    onUpdate: (
        id: number,
        status: "confirmed" | "pending" | "cancelled",
        notes?: string
    ) => void;
}

const AdminAppointmentCard: React.FC<AdminAppointmentCardProps> = ({
    appointment,
    onUpdate,
}) => {
    const statusIcon =
        appointment.status === "confirmed" ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
        ) : appointment.status === "pending" ? (
            <PendingIcon className="w-5 h-5 text-yellow-500" />
        ) : (
            <XCircleIcon className="w-5 h-5 text-red-500" />
        );

    return (
        <motion.div
            className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-4 gap-4"
            whileHover={{ scale: 1.02 }}>
            {/* Provider and Customer */}
            <div className="flex flex-col items-center md:items-start gap-1 flex-1">
                <div className="flex items-center gap-1">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {appointment.provider}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {appointment.customer}
                    </span>
                </div>
            </div>
            {/* Time Section */}
            <div className="w-20 text-center">
                <div className="flex items-center justify-center gap-1">
                    <ClockIcon className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {appointment.formattedTime}
                    </span>
                </div>
            </div>
            {/* Status and Update */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    {statusIcon}
                    <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {appointment.status}
                    </span>
                </div>
                <motion.button
                    className="text-blue-500 hover:text-blue-600"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUpdate(appointment.id, appointment.status)}
                    title="Update Appointment">
                    <PencilIcon className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default AdminAppointmentCard;
