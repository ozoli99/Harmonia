import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} Harmonia. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;