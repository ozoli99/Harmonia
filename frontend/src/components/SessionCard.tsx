import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClipboardIcon } from '@heroicons/react/24/outline';

interface Session {
    id: number;
    client: string;
    date: string;
    type: string;
    notes?: string;
}

interface SessionCardProps {
    session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-[1.03] hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{session.client}</h3>
                <CalendarIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <ClipboardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>{session.type}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📅 {session.date}</p>
            {session.notes && (
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 italic">📝 {session.notes}</p>
            )}
        </motion.div>
    );
};

export default SessionCard;