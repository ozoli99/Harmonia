export interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

export interface Conversation {
    id: number;
    participant: string;
    avatar?: string;
    online?: boolean;
    lastMessage: string;
    timestamp: string;
    isTyping?: boolean;
    unreadCount?: number;
    status?: "sent" | "delivered" | "read";
    messages: Message[];
}
