import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarIcon,
    UserIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    MapPinIcon,
    CreditCardIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    PencilIcon
} from "@heroicons/react/24/outline";

interface Appointment {
    id: number;
    provider: string;
    customer: string;
    formattedTime: string;
    status: "confirmed" | "pending" | "cancelled";
    notes?: string;
}

const statusColors = {
    confirmed: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400",
    pending: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400",
    cancelled: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400",
};

const statusIcons = {
    confirmed: <CheckCircleIcon className="w-5 h-5" />,
    pending: <ClockIcon className="w-5 h-5" />,
    cancelled: <XCircleIcon className="w-5 h-5" />,
};

const AppointmentCard: React.FC<{ appointment: Appointment; onUpdate: (id: number, status: Appointment["status"], notes?: string) => void; }> = ({ appointment, onUpdate }) => {
    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState(appointment.notes || "");
    const [isEditing, setIsEditing] = useState(false);

    return (
        <motion.div
            className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl" />

            <div className="flex justify-between items-center pt-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-blue-500" />
                    {appointment.provider}
                </h3>
                <span className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${statusColors[appointment.status]}`}>
                    {statusIcons[appointment.status]}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">{appointment.customer}</span>
            </p>

            <p className="mt-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                {appointment.formattedTime}
            </p>

            <button
                className="mt-4 flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 transition-all"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Hide Details" : "More details"} <ChevronDownIcon className={`w-5 h-5 ml-2 transform ${expanded ? "rotate-180" : ""} transition-transform`} />
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md p-5 rounded-lg border border-gray-300 dark:border-gray-700 shadow-inner"
                    >
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-red-500" />
                                <span>Location: Wellness Center, Room 5</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-purple-500" />
                                <span>Duration: 60 minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCardIcon className="w-5 h-5 text-green-500" />
                                <span>Payment Status: Paid</span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-900 dark:text-white font-medium">Notes</p>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-blue-500 hover:text-blue-700 transition-all"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                            </div>
                            {isEditing ? (
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full mt-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                    rows={3}
                                />
                            ) : (
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{notes || "No notes added."}</p>
                            )}
                        </div>

                        <div className="mt-5 flex justify-between">
                            <button
                                className="px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-md flex items-center gap-2 transition-all"
                                onClick={() => onUpdate(appointment.id, "pending", notes)}
                            >
                                <ArrowPathIcon className="w-5 h-5" />Reschedule
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md flex items-center gap-2 transition-all"
                                onClick={() => onUpdate(appointment.id, "cancelled", notes)}
                            >
                                <XCircleIcon className="w-5 h-5" />Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AppointmentCard;