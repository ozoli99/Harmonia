import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import clsx from "clsx";
import { CheckCheck, Check, Clock, UserCircle } from "lucide-react";
import type { Conversation } from "../types/messages";

interface Props {
    conversation: Conversation;
    selected: boolean;
    onClick: () => void;
}

const ConversationItem: React.FC<Props> = ({
    conversation,
    selected,
    onClick,
}) => {
    const hasUnread = conversation.unreadCount && conversation.unreadCount > 0;
    const isTyping = conversation.isTyping;

    const getTimeLabel = () => {
        const date = dayjs(conversation.timestamp);
        return dayjs().isSame(date, "day")
            ? date.format("HH:mm")
            : date.format("MMM D");
    };

    const getStatusIcon = () => {
        if (isTyping) return null;

        if (hasUnread) {
            return (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                    }}
                    className="w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
                    {conversation.unreadCount}
                </motion.span>
            );
        }

        if (conversation.status === "delivered")
            return <Check className="w-4 h-4 text-gray-400" />;
        if (conversation.status === "read")
            return <CheckCheck className="w-4 h-4 text-blue-500" />;
        return <Clock className="w-4 h-4 text-gray-400" />;
    };

    const initials = conversation.participant
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            onClick={onClick}
            className={clsx(
                "p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3",
                selected
                    ? "bg-[#CFA15D]/10 border border-[#CFA15D]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}>
            {/* Avatar + Online Dot */}
            <div className="relative w-10 h-10 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-white overflow-hidden">
                    {conversation.avatar ? (
                        <img
                            src={conversation.avatar}
                            alt={conversation.participant}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        initials || <UserCircle className="w-6 h-6" />
                    )}
                </div>

                {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 z-10" />
                )}
            </div>

            {/* Name + Message */}
            <div className="flex-1 min-w-0">
                <h3
                    className={clsx(
                        "truncate text-sm",
                        hasUnread
                            ? "font-semibold text-gray-900 dark:text-white"
                            : "font-medium text-gray-700 dark:text-gray-300"
                    )}>
                    {conversation.participant}
                </h3>

                <div
                    className={clsx(
                        "text-xs truncate",
                        hasUnread
                            ? "text-gray-800 dark:text-gray-200"
                            : "text-gray-500 dark:text-gray-400"
                    )}>
                    {isTyping ? (
                        <div className="flex items-center gap-1">
                            <span className="text-blue-500 font-medium">
                                Typing
                            </span>
                            <motion.span
                                className="flex gap-1"
                                initial="start"
                                animate="pulse"
                                variants={{
                                    pulse: {
                                        transition: {
                                            repeat: Infinity,
                                            staggerChildren: 0.15,
                                        },
                                    },
                                }}>
                                {[...Array(3)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        className="w-1 h-1 rounded-full bg-blue-500"
                                        variants={{
                                            start: { scale: 0.5, opacity: 0.5 },
                                            pulse: {
                                                scale: 1,
                                                opacity: 1,
                                                transition: {
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    repeatType: "mirror",
                                                },
                                            },
                                        }}
                                    />
                                ))}
                            </motion.span>
                        </div>
                    ) : (
                        conversation.lastMessage
                    )}
                </div>
            </div>

            {/* Time + Status */}
            <div className="flex flex-col items-end justify-between h-full min-w-[40px]">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {getTimeLabel()}
                </span>
                {!isTyping && (
                    <span className="mt-1">
                        <AnimatePresence mode="wait">
                            {getStatusIcon()}
                        </AnimatePresence>
                    </span>
                )}
            </div>
        </div>
    );
};

export default ConversationItem;
