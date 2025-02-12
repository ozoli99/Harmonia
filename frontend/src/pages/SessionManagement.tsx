import React from 'react';
import SessionCard from '../components/SessionCard';

interface Session {
    id: number;
    client: string;
    date: string;
    type: string;
    notes?: string;
}

const dummySessions: Session[] = [
    { id: 1, client: 'Client A', date: '2024-12-31 14:00', type: 'Swedish Massage', notes: 'Relaxing session with focus on back' },
    { id: 2, client: 'Client B', date: '2024-11-20 10:00', type: 'Deep Tissue Massage', notes: 'Addressed shoulder tension' },
];

const SessionManagement: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                📋 Session Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dummySessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
};

export default SessionManagement;