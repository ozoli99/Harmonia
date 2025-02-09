import React from 'react';
import { useClerk } from '@clerk/clerk-react';

const LogoutButton: React.FC = () => {
    const clerk = useClerk();

    return (
        <button
            onClick={() => clerk.signOut()}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;