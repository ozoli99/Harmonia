import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="relative mt-20 py-10 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-xl">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Elevate Your Wellness Journey with <span className="text-blue-600 dark:text-blue-400">Harmonia</span>
                </h3>

                <div className="mt-4 flex justify-center space-x-6">
                    <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300">
                        <FaFacebook size={20} />
                    </Link>
                    <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300">
                        <FaTwitter size={20} />
                    </Link>
                    <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300">
                        <FaInstagram size={20} />
                    </Link>
                </div>

                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Harmonia. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;