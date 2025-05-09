import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import clsx from "clsx";

const CalendarPreview: React.FC<{ appointments: any[] }> = ({
    appointments,
}) => {
    const now = dayjs();
    const startOfMonth = now.startOf("month");
    const daysInMonth = now.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) =>
        startOfMonth.add(i, "day")
    );

    const hasAppointment = (day: dayjs.Dayjs) => {
        return appointments?.some((appt) =>
            dayjs(appt.formattedTime, "MMMM D, YYYY").isSame(day, "day")
        );
    };

    return (
        <motion.div
            className="relative bg-white/80 dark:bg-[#1A2A4A]/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#CFA15D]/40 dark:border-[#89AFC8]/40 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            {/* Header */}
            <h4 className="text-lg font-semibold text-[#0C1B33] dark:text-white mb-4">
                Calendar Preview
            </h4>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <span
                            key={day}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {day}
                        </span>
                    )
                )}

                {days.map((day, index) => (
                    <motion.div
                        key={index}
                        className={clsx(
                            "w-10 h-10 flex items-center justify-center rounded-lg border transition-all",
                            hasAppointment(day)
                                ? "border-[#CFA15D] bg-[#CFA15D]/20 dark:bg-[#89AFC8]/20 text-[#CFA15D] dark:text-[#89AFC8]"
                                : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                        whileHover={{ scale: 1.05 }}>
                        <span className="text-sm font-medium">
                            {day.format("D")}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CalendarPreview;
