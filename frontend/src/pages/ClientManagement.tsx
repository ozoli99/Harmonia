import React, { useState } from 'react';
import Modal from '../components/Modal';

interface Client {
    id: number;
    name: string;
    email: string;
    lastAppointment: string;
    details: string;
}

const dummyClients: Client[] = [
    {
        id: 1,
        name: 'Client A',
        email: 'clienta@example.com',
        lastAppointment: '2024-12-31 14:00',
        details: 'Regular client, prefers Swedish Massage.'
    },
    {
        id: 2,
        name: 'Client B',
        email: 'clientb@example.com',
        lastAppointment: '2024-11-20 10:00',
        details: 'First-time visitor, interested in Deep Tissue.'
    },
];

const ClientManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const filteredClients = dummyClients.filter(client =>
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
                {filteredClients.map(client => (
                    <div
                        key={client.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition cursor-pointer"
                        onClick={() => setSelectedClient(client)}
                    >
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{client.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{client.email}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Last appointment: {client.lastAppointment}</p>
                    </div>
                ))}
            </div>
            {selectedClient && (
                <Modal isOpen={true} onClose={() => setSelectedClient(null)}>
                    <div className="p-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{selectedClient.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            <strong>Email:</strong> {selectedClient.email}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            <strong>Last Appointment:</strong> {selectedClient.lastAppointment}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <strong>Details:</strong> {selectedClient.details}
                        </p>
                        <button
                            onClick={() => setSelectedClient(null)}
                            className="mt-4 py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ClientManagement;