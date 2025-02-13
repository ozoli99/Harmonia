import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "../types/client";
import { motion } from "framer-motion";
import {
    UserIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon,
    ChatBubbleLeftIcon,
    CalendarIcon,
    PhoneIcon
} from "@heroicons/react/24/outline";
import { useAppointmentTimer } from "../hooks/useAppointmentTimer";

const trendIcons = {
    increasing: <ArrowTrendingUpIcon className="w-6 h-6 text-green-500 drop-shadow-md" title="Increasing Visits" />,
    declining: <ArrowTrendingDownIcon className="w-6 h-6 text-red-500 drop-shadow-md" title="Declining Visits" />,
    stable: <MinusIcon className="w-6 h-6 text-gray-500" title="Stable Visits" />,
};

interface ClientCardProps {
    client: Client;
    openBookingModal: (client: Client) => void;
    toggleReminder: (clientId: number) => void;
    setSelectedTag: (tag: "VIP" | "Frequent" | "New") => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, openBookingModal, toggleReminder, setSelectedTag }) => {
    const navigate = useNavigate();

    const nextAppointment = useMemo(
        () =>
          client.appointmentHistory.find(
            (appt) => new Date(appt.date) >= new Date()
          ) || null,
        [client.appointmentHistory]
      );
    
      const timeRemaining = useAppointmentTimer(
        nextAppointment ? new Date(nextAppointment.date) : null
      );
    
      const ratingBorderColor = client.feedback.length
        ? client.feedback.reduce((sum, item) => sum + item.rating, 0) /
            client.feedback.length >= 4
          ? "border-green-500"
          : "border-yellow-500"
        : "border-gray-300";

    const handleCardClick = () => {
        navigate("/profile", { state: { client } });
    };

    const handleLastVisitClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate("/calendar");
    };

    const handleMessageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate("/messages", { state: { client } });
    };

    const handleAppointmentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openBookingModal(client);
    };

    return (
        <motion.div 
            key={client.id} 
            onClick={handleCardClick}
            className="relative p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl active:scale-95"
            whileHover={{ scale: 1.02 }}
        >
            {/* Live Appointment Indicator */}
            {nextAppointment && new Date(nextAppointment.date).toDateString() === new Date().toDateString() && (
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
                    className={`absolute top-1 left-1 text-xs px-3 py-1 rounded-full font-medium text-white shadow-lg z-10
                        ${client.tag === "VIP" ? "bg-yellow-500/90" : client.tag === "Frequent" ? "bg-green-500/90" : "bg-blue-500/90"}`}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(client.tag);
                    }}
                    style={{ cursor: "pointer" }}
                >
                    {client.tag}
                </motion.span>
            )}

            {/* Profile & Basic Info */}
            <div className="flex items-center justify-between">
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        📅{" "}
                        <span
                            onClick={handleLastVisitClick}
                            className="underline cursor-pointer"
                        >
                            Last Visit: {client.lastAppointment}
                        </span>
                    </p>
                    {timeRemaining && <p className="text-blue-500 text-sm font-medium">⏳ Next: {timeRemaining}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <motion.button
                        className="text-gray-600 hover:text-green-500 transition-all"
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log(`Calling ${client.name}`); }}
                    >
                        <PhoneIcon className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        className="text-gray-600 hover:text-blue-500 transition-all"
                        whileTap={{ scale: 0.9 }}
                        onClick={handleMessageClick}
                    >
                        <ChatBubbleLeftIcon className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        className="text-gray-600 hover:text-purple-500 transition-all"
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAppointmentClick}
                    >
                        <CalendarIcon className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ClientCard;