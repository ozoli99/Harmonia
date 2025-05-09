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
            className="relative bg-white/80 dark:bg-[#1A2A4A]/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#CFA15D]/40 dark:border-[#89AFC8]/40 p-6 space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#0C1B33] dark:text-white tracking-tight">
                    Recent Messages
                </h3>
                <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Messages List */}
            <div className="space-y-3">
                {messages.length > 0 ? (
                    messages.slice(0, 4).map((msg) => (
                        <motion.div
                            key={msg.id}
                            className="flex items-start gap-3 bg-gradient-to-br from-white/60 to-gray-100 dark:from-[#1A2A4A]/50 dark:to-[#0C1B33]/50 px-4 py-3 rounded-xl shadow-md border border-[#CFA15D]/30 dark:border-[#89AFC8]/30 transition-all"
                            whileHover={{ scale: 1.02 }}>
                            {/* Sender Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-[#CFA15D] dark:border-[#89AFC8]">
                                {msg.avatar ? (
                                    <img
                                        src={msg.avatar}
                                        alt={msg.sender}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <UserIcon className="w-7 h-7" />
                                    </div>
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
                        No new messages.
                    </p>
                )}
            </div>

            {/* View All Button */}
            <motion.button
                className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#CFA15D] to-[#F5F5F5] dark:from-[#CFA15D] dark:to-[#89AFC8] text-[#0C1B33] font-medium rounded-lg shadow-md hover:from-[#E1B877] hover:to-[#FAFAFA] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewAll}>
                View All Messages
            </motion.button>
        </motion.div>
    );
};

export default MessagesWidget;
