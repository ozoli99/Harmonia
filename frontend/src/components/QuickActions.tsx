import React from "react";
import { motion } from "framer-motion";
import {
    CalendarIcon,
    UserIcon,
    ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

const QuickActions: React.FC = () => {
    const handleAction = (action: string) => {
        console.log(`Quick Action: ${action}`);
    };
    return (
        <motion.div
            className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <motion.button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-600"
                onClick={() => handleAction("Book Appointment")}
                whileTap={{ scale: 0.95 }}>
                <CalendarIcon className="w-5 h-5" />
                Book Appointment
            </motion.button>
            <motion.button
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-green-600"
                onClick={() => handleAction("View Profile")}
                whileTap={{ scale: 0.95 }}>
                <UserIcon className="w-5 h-5" />
                View Profile
            </motion.button>
            <motion.button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-purple-600"
                onClick={() => handleAction("Send Message")}
                whileTap={{ scale: 0.95 }}>
                <ChatBubbleLeftIcon className="w-5 h-5" />
                Send Message
            </motion.button>
        </motion.div>
    );
};

export default QuickActions;
