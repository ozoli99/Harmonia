import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Client {
    id: number;
    name: string;
    email: string;
    lastAppointment: string;
}

interface ClientCardProps {
    client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-[1.03] hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center gap-3">
                <UserCircleIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{client.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Last Appointment: {client.lastAppointment}
            </div>
        </motion.div>
    );
};

export default ClientCard;