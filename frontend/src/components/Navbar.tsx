import React from 'react';
import { Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import DarkModeToggle from './DarkModeToggle';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
                    Harmonia
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 dark:text-gray-200 hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link to="/appointments" className="text-gray-600 dark:text-gray-200 hover:text-blue-600 transition-colors">
                        Appointments
                    </Link>
                    <Link to="/profile" className="text-gray-600 dark:text-gray-200 hover:text-blue-600 transition-colors">
                        Profile
                    </Link>
                    <DarkModeToggle />
                    <UserManagement />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;