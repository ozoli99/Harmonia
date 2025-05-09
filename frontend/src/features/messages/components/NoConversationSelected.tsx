import React from "react";
import Lottie from "lottie-react";
import emptyChatAnimation from "../../../assets/empty-chat-animation.json";

const NoConversationSelected = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
        <div className="w-64 h-64 mb-6">
            <Lottie animationData={emptyChatAnimation} loop={true} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Conversation Selected
        </h2>
        <p className="max-w-sm text-sm mb-4">
            Select a conversation from the left to start chatting with your
            client.
        </p>
        <span className="text-xs text-gray-400">
            You’ll see messages and typing activity here.
        </span>
    </div>
);

export default NoConversationSelected;
