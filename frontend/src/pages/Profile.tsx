import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../components/LogoutButton';

const Profile: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <div>Loading...</div>;

    if (!isAuthenticated) return <div>You are not logged in</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <img
                    src={user?.picture}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full mx-auto border border-gray-300"
                />
                <h2 className="mt-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {user?.name}
                </h2>
                <p className="mt-2 text-center text-gray-600 dark:text-gray-300">{user?.email}</p>
                <div className="mt-4 flex justify-center">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};

export default Profile;