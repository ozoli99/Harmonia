import React, { useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";

interface ChatBubbleProps {
    sender: string;
    text: string;
    timestamp: string;
}

const emojiOptions = ["👍", "❤️", "😂", "😮"];

const ChatBubble: React.FC<ChatBubbleProps> = ({ sender, text, timestamp }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [reaction, setReaction] = useState<string | null>(null);

    return (
        <div
            className={clsx(
                "group relative max-w-xs px-4 py-2 rounded-lg text-sm",
                sender === "me"
                    ? "ml-auto bg-[#CFA15D] text-white"
                    : "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            )}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}>
            {text}
            <span className="absolute text-[10px] text-gray-500 dark:text-gray-400 bottom-[-1.5rem] right-0">
                {dayjs(timestamp).fromNow()}
            </span>

            {reaction && (
                <span className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full shadow px-1">
                    {reaction}
                </span>
            )}

            {showReactions && !reaction && (
                <div className="absolute -top-7 left-0 bg-white dark:bg-gray-800 shadow rounded-full px-2 py-1 flex gap-1 z-10">
                    {emojiOptions.map((emoji) => (
                        <button
                            key={emoji}
                            className="hover:scale-110 transition"
                            onClick={() => setReaction(emoji)}>
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatBubble;
