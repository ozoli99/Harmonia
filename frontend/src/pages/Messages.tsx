import React, { useState } from 'react';
import Modal from '../components/Modal';

interface Conversation {
    id: number;
    participant: string;
    lastMessage: string;
    timestamp: string;
}

const dummyConversations: Conversation[] = [
    { id: 1, participant: 'Client A', lastMessage: 'Looking forward to our session!', timestamp: '2024-12-31 14:00' },
    { id: 2, participant: 'Client B', lastMessage: 'Can we reschedule?', timestamp: '2024-11-20 10:00' },
];

const Messages: React.FC = () => {
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Messages</h2>
            <div className="space-y-4">
                {dummyConversations.map(conv => (
                    <div
                        key={conv.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition cursor-pointer"
                        onClick={() => setSelectedConv(conv)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{conv.participant}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{conv.timestamp}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{conv.lastMessage}</p>
                    </div>
                ))}
            </div>
            {selectedConv && (
                <Modal isOpen={true} onClose={() => setSelectedConv(null)}>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Conversation with {selectedConv.participant}
                        </h3>
                        <div className="space-y-2">
                            {/* Dummy conversation messages */}
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">Hello, how are you?</div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-700 rounded self-end">I'm doing well, thank you!</div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Messages;