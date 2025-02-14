import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface Appointment {
    id: number;
    provider: string;
    customer: string;
    formattedTime: string;
    status: "confirmed" | "pending" | "cancelled";
}

interface UpcomingAppointmentsWidgetProps {
    appointments: Appointment[];
    onViewAll?: () => void;
}

const UpcomingAppointmentsWidget: React.FC<UpcomingAppointmentsWidgetProps> = ({
    appointments,
    onViewAll,
}) => {
    const upcoming = (appointments || [])
        .filter((appointment) => appointment.status === "confirmed")
        .slice(0, 2);

    return (
        <motion.div
            className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upcoming Appointments
                </h4>
                {onViewAll && (
                    <motion.button
                        className="text-blue-500 hover:text-blue-600 text-sm"
                        whileTap={{ scale: 0.95 }}
                        onClick={onViewAll}>
                        View All
                    </motion.button>
                )}
            </div>
            {upcoming.length > 0 ? (
                upcoming.map((appt) => (
                    <div
                        key={appt.id}
                        className="mb-2 p-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-100">
                            {appt.provider} with {appt.customer} @{" "}
                            {appt.formattedTime}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    No upcoming appointments.
                </p>
            )}
        </motion.div>
    );
};

export default UpcomingAppointmentsWidget;
