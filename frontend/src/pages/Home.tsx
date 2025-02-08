import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome to Harmonia</h1>
            <p className="text-xl text-gray-700 mb-8">
                Your centralized platform for massage service management.
            </p>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded">
                Get Started
            </Link>
        </div>
    );
};

export default Home;