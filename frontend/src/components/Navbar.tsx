import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const Navbar: React.FC = () => {
    const { isAuthenticated } = useAuth0();
  
    return (
        <nav className="bg-white dark:bg-gray-800 shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
                    Harmonia
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">
                        Home
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">
                                Profile
                            </Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </div>
        </nav>
    );
};  

export default Navbar;