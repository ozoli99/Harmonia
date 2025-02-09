import React, { useState } from 'react';

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
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = (sessionId: number) => {
        // TODO: Integrate API call to update session notes.
        console.log(`Adding note to session ${sessionId}: ${newNote}`);
        setNewNote('');
        setSelectedSession(null);
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Session Management</h2>
            <div className="space-y-4">
                {dummySessions.map(session => (
                    <div
                        key={session.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition cursor-pointer"
                        onClick={() => setSelectedSession(session)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{session.client}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{session.date}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{session.type}</p>
                        {session.notes && <p className="text-gray-500 dark:text-gray-400 mt-1 italic">Notes: {session.notes}</p>}
                    </div>
                ))}
            </div>
            {selectedSession && (
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Add/Edit Note for {selectedSession.client}
                    </h3>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter session notes..."
                        rows={4}
                    />
                    <button
                        onClick={() => handleAddNote(selectedSession.id)}
                        className="mt-4 py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save Note
                    </button>
                </div>
            )}
        </div>
    );
};

export default SessionManagement;