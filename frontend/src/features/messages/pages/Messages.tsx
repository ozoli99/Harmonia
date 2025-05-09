import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Clock, Pin, Plus, Search } from "lucide-react";

import ChatBubble from "@features/messages/components/ChatBubble";
import ChatInput from "@features/messages/components/ChatInput";
import NoConversationSelected from "@features/messages/components/NoConversationSelected";
import ConversationItem from "../components/ConversationItem";
import { Message } from "../types/messages";
import { Conversation } from "../types/messages";

dayjs.extend(relativeTime);

const onlineClients = [
    { id: 1, name: "Anna", avatar: "", online: true },
    { id: 2, name: "Ben", avatar: "", online: true },
    { id: 3, name: "Carla", avatar: "", online: true },
    { id: 4, name: "Daniel", avatar: "", online: true },
    { id: 5, name: "Emma", avatar: "", online: true },
    { id: 6, name: "John", avatar: "", online: true },
    { id: 7, name: "Jake", avatar: "", online: true },
];

const pinnedConversations: Conversation[] = [
    {
        id: 3,
        participant: "Client A",
        lastMessage: "Looking forward to our session!",
        timestamp: "2024-12-31T14:00:00",
        messages: [
            {
                sender: "them",
                content: "Hello, how are you?",
                timestamp: "2024-12-31T13:55:00",
            },
            {
                sender: "me",
                content: "I'm doing well, thank you! 😊",
                timestamp: "2024-12-31T13:57:00",
            },
        ],
    },
    {
        id: 4,
        participant: "Client A",
        lastMessage: "Looking forward to our session!",
        timestamp: "2024-12-31T14:00:00",
        unreadCount: 1,
        messages: [
            {
                sender: "them",
                content: "Hello, how are you?",
                timestamp: "2024-12-31T13:55:00",
            },
            {
                sender: "me",
                content: "I'm doing well, thank you! 😊",
                timestamp: "2024-12-31T13:57:00",
            },
        ],
    },
];

const recentConversations: Conversation[] = [
    {
        id: 1,
        participant: "Client A",
        lastMessage: "Looking forward to our session!",
        timestamp: "2024-12-31T14:00:00",
        messages: [
            {
                sender: "them",
                content: "Hello, how are you?",
                timestamp: "2024-12-31T13:55:00",
            },
            {
                sender: "me",
                content: "I'm doing well, thank you! 😊",
                timestamp: "2024-12-31T13:57:00",
            },
        ],
    },
    {
        id: 2,
        participant: "Client B",
        lastMessage: "Can we reschedule?",
        timestamp: "2024-11-20T10:00:00",
        messages: [
            {
                sender: "them",
                content: "Can we reschedule?",
                timestamp: "2024-11-20T10:00:00",
            },
        ],
    },
];

const Messages: React.FC = () => {
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (content: string) => {
        if (!content.trim() || !selectedConv) return;

        const newMessage: Message = {
            sender: "me",
            content,
            timestamp: new Date().toISOString(),
        };

        setSelectedConv((prev) =>
            prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev
        );
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConv?.messages]);

    useEffect(() => {
        if (selectedConv?.participant === "Client A") {
            const timeout = setTimeout(() => setIsTyping(true), 1000);
            const stopTyping = setTimeout(() => setIsTyping(false), 4000);
            return () => {
                clearTimeout(timeout);
                clearTimeout(stopTyping);
            };
        }
    }, [selectedConv]);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <aside className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 space-y-6 bg-white dark:bg-gray-900">
                {/* Header row */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Messages
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Online now avatars */}
                <div>
                    <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Online Now
                    </h4>
                    <div className="flex items-center gap-3">
                        {onlineClients.map((user) => (
                            <div
                                key={user.id}
                                className="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-white">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    user.name[0]
                                )}
                                {user.online && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pinned conversations */}
                <div>
                    <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <Pin className="w-4 h-4" /> Pinned
                    </h4>
                    {pinnedConversations.length > 0 ? (
                        [...pinnedConversations]
                            .sort(
                                (a, b) =>
                                    (b.unreadCount ?? 0) - (a.unreadCount ?? 0)
                            )
                            .map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    selected={
                                        selectedConv?.id === conversation.id
                                    }
                                    onClick={() =>
                                        setSelectedConv(conversation)
                                    }
                                />
                            ))
                    ) : (
                        <p className="text-sm text-gray-400">No pinned chats</p>
                    )}
                </div>

                {/* Recent conversations */}
                <div>
                    <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Recent
                    </h4>
                    {[...recentConversations]
                        .sort(
                            (a, b) =>
                                (b.unreadCount ?? 0) - (a.unreadCount ?? 0)
                        )
                        .map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                selected={selectedConv?.id === conversation.id}
                                onClick={() => setSelectedConv(conversation)}
                            />
                        ))}
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 p-6">
                {selectedConv ? (
                    <>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Chat with {selectedConv.participant}
                            </h3>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-1">
                            {selectedConv.messages.map((msg, i) => (
                                <ChatBubble
                                    key={i}
                                    sender={msg.sender}
                                    text={msg.content}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {isTyping && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 italic">
                                {selectedConv?.participant} is typing...
                            </div>
                        )}

                        <ChatInput onSend={handleSend} />
                    </>
                ) : (
                    <NoConversationSelected />
                )}
            </main>
        </div>
    );
};

export default Messages;
