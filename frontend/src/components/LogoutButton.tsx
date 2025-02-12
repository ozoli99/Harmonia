import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { motion } from "framer-motion";

const LogoutButton: React.FC = () => {
    const clerk = useClerk();

    return (
        <motion.button
            onClick={() => clerk.signOut()}
            whileHover={{ scale: 1.05, backgroundPosition: "100% 100%" }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden py-3 px-6 font-semibold rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl backdrop-blur-lg border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
            Log Out
        </motion.button>
    );
};

export default LogoutButton;