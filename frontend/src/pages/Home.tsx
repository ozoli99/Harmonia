import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from '../components/LoginButton';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-5xl font-bold text-harmoniaBlue dark:text-white mb-4">
                Welcome to Harmonia
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Your centralized platform for massage service management.
            </p>
            <LoginButton />
            <Link to="/login" className="bg-harmoniaBlue hover:bg-harmoniaBlue.dark text-white py-2 px-6 rounded">
                Get Started
            </Link>
        </div>
    );
};

export default Home;