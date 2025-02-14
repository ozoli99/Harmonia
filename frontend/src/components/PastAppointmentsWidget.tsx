import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon, PencilIcon } from "@heroicons/react/24/outline";

interface Appointment {
    id: number;
    provider: string;
    customer: string;
    formattedTime: string;
    status: "confirmed" | "pending" | "cancelled";
}

interface PastAppointmentsWidgetProps {
    appointments: Appointment[];
    onViewDetails: (id: number) => void;
}

const PastAppointmentsWidget: React.FC<PastAppointmentsWidgetProps> = ({
    appointments,
    onViewDetails,
}) => {
    return (
        <motion.div
            className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Past Appointments &amp; History
            </h3>
            {(appointments || []).length > 0 ? (
                appointments.map((appt) => (
                    <div
                        key={appt.id}
                        className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-sm text-gray-900 dark:text-white">
                                {appt.provider}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                @ {appt.formattedTime}
                            </span>
                        </div>
                        <motion.button
                            className="text-blue-500 hover:text-blue-600"
                            whileTap={{ scale: 0.95 }}
                            title="View Details / Feedback"
                            onClick={() => onViewDetails(appt.id)}>
                            <PencilIcon className="w-5 h-5" />
                        </motion.button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    No past appointments.
                </p>
            )}
        </motion.div>
    );
};

export default PastAppointmentsWidget;
