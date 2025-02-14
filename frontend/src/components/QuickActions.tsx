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
        <div className="flex space-x-4">
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
        </div>
    );
};

export default QuickActions;
