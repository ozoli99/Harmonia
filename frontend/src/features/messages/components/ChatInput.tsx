import React, { useState, useRef } from "react";
import EmojiPicker, {
    EmojiClickData,
    Theme,
    EmojiStyle,
} from "emoji-picker-react";
import { SendIcon, Smile } from "lucide-react";

interface ChatInputProps {
    onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [input, setInput] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setInput("");
        setShowEmoji(false);
    };

    const handleEmojiSelect = (emojiData: EmojiClickData) => {
        setInput((prev) => prev + emojiData.emoji);
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CFA15D] bg-white dark:bg-gray-800 text-sm"
                    placeholder="Type a message..."
                />
                <button
                    type="button"
                    onClick={() => setShowEmoji((prev) => !prev)}
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    title="Insert emoji">
                    <Smile className="w-5 h-5" />
                </button>
                <button
                    onClick={handleSend}
                    className="p-2 bg-[#CFA15D] text-white rounded-full hover:bg-[#b78842] transition"
                    title="Send message">
                    <SendIcon className="w-4 h-4" />
                </button>
            </div>

            {showEmoji && (
                <div
                    ref={emojiRef}
                    className="absolute bottom-12 left-0 z-50 shadow-lg bg-white dark:bg-[#1A2A4A] border border-gray-200 dark:border-gray-700 rounded-lg">
                    <EmojiPicker
                        onEmojiClick={handleEmojiSelect}
                        theme={Theme.AUTO}
                        emojiStyle={EmojiStyle.NATIVE}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatInput;
