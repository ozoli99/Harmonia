import React from "react";
import { motion } from "framer-motion";
import {
    PhoneIcon,
    ChatBubbleLeftIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import { Client } from "../types/client";

export interface ActionButtonProps {
    client: Client;
    onMessage: (e: React.MouseEvent) => void;
    onAppointment: (e: React.MouseEvent) => void;
}

const ActionButtons: React.FC<ActionButtonProps> = ({
    client,
    onMessage,
    onAppointment,
}) => {
    return (
        <div className="flex gap-4">
            <motion.button
                aria-label="Call client"
                className="text-gray-600 hover:text-green-500 transition-all"
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Calling ${client.name}`);
                }}>
                <PhoneIcon className="w-6 h-6" />
            </motion.button>
            <motion.button
                aria-label="Send message"
                className="text-gray-600 hover:text-blue-500 transition-all"
                whileTap={{ scale: 0.9 }}
                onClick={onMessage}>
                <ChatBubbleLeftIcon className="w-6 h-6" />
            </motion.button>
            <motion.button
                aria-label="Book appointment"
                className="text-gray-600 hover:text-purple-500 transition-all"
                whileTap={{ scale: 0.9 }}
                onClick={onAppointment}>
                <CalendarIcon className="w-6 h-6" />
            </motion.button>
        </div>
    );
};

export default React.memo(ActionButtons);
