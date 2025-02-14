import React from "react";
import { motion } from "framer-motion";

export interface AppointmentIndicatorProps {
    isToday: boolean;
}

const AppointmentIndicator: React.FC<AppointmentIndicatorProps> = ({
    isToday,
}) => {
    if (!isToday) return null;
    return (
        <motion.div
            className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full shadow-md ring-2 ring-white dark:ring-gray-900"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            title="Today's Appointment"
        />
    );
};

export default React.memo(AppointmentIndicator);
