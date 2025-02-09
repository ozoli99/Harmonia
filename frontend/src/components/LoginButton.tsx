import React from 'react';
import { useClerk } from '@clerk/clerk-react';

const LoginButton: React.FC = () => {
    const clerk = useClerk();

    return (
        <button
            onClick={() => clerk.openSignIn()}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        >
            Log In
        </button>
    );
};

export default LoginButton;