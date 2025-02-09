import React, { useState } from 'react';

interface Client {
    id: number;
    name: string;
    email: string;
    lastAppointment: string; // Date string
    avatarUrl?: string;
}

const dummyClients: Client[] = [
    { id: 1, name: 'Client A', email: 'clienta@example.com', lastAppointment: '2024-12-31 14:00' },
    { id: 2, name: 'Client B', email: 'clientb@example.com', lastAppointment: '2024-11-20 10:00' },
];

const ClientCard: React.FC<{ client: Client }> = ({ client }) => (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-xl transition">
        <img
            src={client.avatarUrl || "https://via.placeholder.com/50"}
            alt={client.name}
            className="w-12 h-12 rounded-full mr-4"
        />
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{client.name}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{client.email}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
                Last appointment: {client.lastAppointment}
            </p>
        </div>
    </div>
);

const ClientManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = dummyClients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Client Management</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-4">
                {filteredClients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
};

export default ClientManagement;