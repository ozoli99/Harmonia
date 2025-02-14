import React from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftIcon, UserIcon } from "@heroicons/react/24/outline";

interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    avatar?: string;
}

interface MessagesWidgetProps {
    messages: Message[];
    onViewAll: () => void;
}

const MessagesWidget: React.FC<MessagesWidgetProps> = ({
    messages,
    onViewAll,
}) => {
    return (
        <motion.div
            className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    Messages & Communication
                </h3>
                <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Messages */}
            <div className="space-y-3">
                {messages.length > 0 ? (
                    messages.slice(0, 4).map((msg) => (
                        <motion.div
                            key={msg.id}
                            className="flex items-start gap-3 bg-gray-100/70 dark:bg-gray-800/60 px-4 py-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all"
                            whileHover={{ scale: 1.02 }}>
                            {/* Sender Avatar */}
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                                {msg.avatar ? (
                                    <img
                                        src={msg.avatar}
                                        alt={msg.sender}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                )}
                            </div>

                            {/* Message Content */}
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {msg.sender}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {msg.timestamp}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight mt-1">
                                    {msg.content}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
                        No recent messages.
                    </p>
                )}
            </div>

            {/* View All Button */}
            <motion.button
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewAll}>
                View All Messages
            </motion.button>
        </motion.div>
    );
};

export default MessagesWidget;
