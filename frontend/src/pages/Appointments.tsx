import React, { useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import { motion } from "framer-motion";

const initialAppointments = [
    { id: 1, provider: "Masseur A", customer: "Client A", time: "2024-12-31 14:00", status: "confirmed", notes: "" },
    { id: 2, provider: "Masseur B", customer: "Client B", time: "2024-12-31 15:30", status: "pending", notes: "" },
    { id: 3, provider: "Masseur C", customer: "Client C", time: "2024-12-31 17:00", status: "cancelled", notes: "" },
    { id: 4, provider: "Masseur D", customer: "Client D", time: "2024-08-01 12:00", status: "confirmed", notes: "" },
];

const formatDate = (timestamp: string) => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [view, setView] = useState<"upcoming" | "history">("upcoming");
    const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");

    const currentDate = new Date();

    const upcomingAppointments = appointments.filter((appointment) => new Date(appointment.time) >= currentDate);
    const pastAppointments = appointments.filter((appointment) => new Date(appointment.time) < currentDate);

    const handleUpdate = (id: number, status: "confirmed" | "pending" | "cancelled", notes?: string) => {
        setAppointments((prev) =>
            prev.map((appointment) =>
                appointment.id === id ? { ...appointment, status, notes: notes || appointment.notes } : appointment
            )
        );
    };

    const displayedAppointments = view === "upcoming" ? filter === "all" ? upcomingAppointments : upcomingAppointments.filter((a) => a.status === filter) : pastAppointments;

    return (
        <div className="min-h-screen px-8 py-24 bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
            <motion.h2
                className="text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-12 tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {view === "upcoming" ? "Your Upcoming Appointments" : "Appointment History"}
            </motion.h2>

            <div className="flex justify-center space-x-6 mb-8">
                <button
                    className={`px-6 py-3 rounded-full font-medium transition-all ${
                        view === "upcoming"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setView("upcoming")}
                >
                    Upcoming
                </button>
                <button
                    className={`px-6 py-3 rounded-full font-medium transition-all ${
                        view === "history"
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setView("history")}
                >
                    History
                </button>
            </div>

            {view === "upcoming" && (
                <div className="flex justify-center space-x-4 mb-8">
                    {["all", "confirmed", "pending", "cancelled"].map((status) => (
                        <button
                            key={status}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                                filter === status
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setFilter(status as "all" | "confirmed" | "pending" | "cancelled")}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {displayedAppointments.length > 0 ? (
                <motion.div
                    className="max-w-4xl mx-auto space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {displayedAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={{
                                ...appointment,
                                formattedTime: formatDate(appointment.time),
                                status: appointment.status as "confirmed" | "pending" | "cancelled",
                            }}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-400 text-lg mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center animate-pulse">
                        📅
                    </div>
                    <p className="mt-6 text-xl font-medium">
                        {view === "upcoming"
                            ? "No upcoming appointments"
                            : "No appointment history found"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">Schedule one to get started</p>
                    {view === "upcoming" && (
                        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all hover:shadow-xl animate-bounce">
                            Book an Appointment
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Appointments;
