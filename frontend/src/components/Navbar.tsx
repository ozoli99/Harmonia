import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Harmonia
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-600">
                        Home
                    </Link>
                    <Link to="/login" className="text-gray-600 hover:text-blue-600">
                        Login
                    </Link>
                    <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                        Dashboard
                    </Link>
                    <Link to="/appointments" className="text-gray-600 hover:text-blue-600">
                        Appointments
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                        Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;