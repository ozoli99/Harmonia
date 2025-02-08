import React from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-harmoniaBlue dark:text-white">
                    Harmonia
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-gray-600 dark:text-gray-200 hover:text-harmoniaBlue">
                        Home
                    </Link>
                    <Link to="/login" className="text-gray-600 dark:text-gray-200 hover:text-harmoniaBlue">
                        Login
                    </Link>
                    <Link to="/dashboard" className="text-gray-600 dark:text-gray-200 hover:text-harmoniaBlue">
                        Dashboard
                    </Link>
                    <Link to="/appointments" className="text-gray-600 dark:text-gray-200 hover:text-harmoniaBlue">
                        Appointments
                    </Link>
                    <Link to="/profile" className="text-gray-600 dark:text-gray-200 hover:text-harmoniaBlue">
                        Profile
                    </Link>
                    <DarkModeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;