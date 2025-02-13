import React, { useEffect, useState, useRef } from "react";
import { Client } from "../types/client";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon,
    BellIcon,
    BellSlashIcon,
    ChatBubbleLeftIcon,
    CalendarIcon,
    PhoneIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import { getTotalVisits, getMostFrequentService, getTrendStatus } from "../utils/clientHelpers";

const trendIcons = {
    increasing: <ArrowTrendingUpIcon className="w-5 h-5 text-green-500 drop-shadow-md" title="Increasing Visits" />,
    declining: <ArrowTrendingDownIcon className="w-5 h-5 text-red-500 drop-shadow-md" title="Declining Visits" />,
    stable: <MinusIcon className="w-5 h-5 text-gray-500" title="Stable Visits" />,
};

interface ClientCardProps {
    client: Client;
    onClick: () => void;
    toggleReminder: (clientId: number) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick, toggleReminder }) => {
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
    const [isToday, setIsToday] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!client.appointmentHistory.length) return;

        const upcomingAppointment = client.appointmentHistory.find(appt => new Date(appt.date) >= new Date());
        if (!upcomingAppointment) return;

        const appointmentDate = new Date(upcomingAppointment.date);
        const now = new Date();

        const isTodayAppt = appointmentDate.toDateString() === now.toDateString();
        setIsToday(isTodayAppt);

        if (!isTodayAppt && appointmentDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
            const updateTimer = () => {
                const now = new Date();
                const timeDiff = appointmentDate.getTime() - now.getTime();

                if (timeDiff <= 0) {
                    setTimeRemaining("Now");
                    return;
                }

                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
            };

            updateTimer();
            const timer = setInterval(updateTimer, 60000);
            return () => clearInterval(timer);
        }
    }, [client.appointmentHistory]);

    const getAverageRating = (feedback: { rating: number }[]) => {
        if (feedback.length === 0) return "No ratings yet";
        const avg = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;
        return avg.toFixed(1);
    };

    const ratingBorderColor = client.feedback.length
        ? client.feedback.reduce((sum, item) => sum + item.rating, 0) / client.feedback.length >= 4
            ? "border-green-500"
            : "border-yellow-500"
        : "border-gray-300";

    return (
        <motion.div 
            key={client.id} 
            onClick={onClick}
            className="relative p-6 bg-white/50 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl active:scale-95"
            whileHover={{ scale: 1.02 }}
        >
            {/* Live Appointment Indicator */}
            {isToday && (
                <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full shadow-md ring-2 ring-white dark:ring-gray-900"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    title="Today's Appointment"
                />
            )}

            {/* VIP / Frequent / New Badge */}
            {client.tag && (
                <motion.span
                    className={`absolute top-1 left-1 text-xs px-2 py-1 rounded-full font-medium text-white shadow-lg z-10
                        ${client.tag === "VIP" ? "bg-yellow-500/90" : client.tag === "Frequent" ? "bg-green-500/90" : "bg-blue-500/90"}`}
                    whileHover={{ scale: 1.1 }}
                >
                    {client.tag}
                </motion.span>
            )}

            {/* Profile & Basic Info */}
            <div className="flex items-center justify-between" onClick={() => setExpanded(!expanded)}>
                {/* Profile Image */}
                <div className={`relative w-16 h-16 rounded-full border-4 ${ratingBorderColor} flex items-center justify-center overflow-hidden shadow-md`}>
                    {client.avatar ? (
                        <img src={client.avatar} alt={client.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <UserIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
                    )}
                </div>

                {/* Client Name & Short Info */}
                <div className="flex-1 ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">📅 Last Visit: {client.lastAppointment}</p>
                    {timeRemaining && <p className="text-blue-500 text-sm font-medium">⏳ Next: {timeRemaining}</p>}
                </div>

                {/* Expand Button */}
                <motion.button className="text-gray-600 hover:text-gray-900 transition-all">
                    <ChevronDownIcon className={`w-6 h-6 transform ${expanded ? "rotate-180" : ""}`} />
                </motion.button>
            </div>

            {/* Expanded Section */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-300 dark:border-gray-700"
                    >
                        {/* Client Details */}
                        <p className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                            <CalendarIcon className="w-4 h-4 mr-2 text-purple-500" />
                            Most Booked: {getMostFrequentService(client.appointmentHistory)}
                        </p>
                        <p className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                            ⭐ {getAverageRating(client.feedback)} Rating
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            <motion.button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:text-green-500 transition-all"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Calling ${client.name}`);
                                }}
                            >
                                <PhoneIcon className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:text-blue-500 transition-all"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Messaging ${client.name}`);
                                }}
                            >
                                <ChatBubbleLeftIcon className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:text-purple-500 transition-all"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Scheduling for ${client.name}`);
                                }}
                            >
                                <CalendarIcon className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ClientCard;