import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { motion } from "framer-motion";

const LoginButton: React.FC = () => {
    const clerk = useClerk();

    return (
        <motion.button
            onClick={() => clerk.openSignIn()}
            whileHover={{ scale: 1.05, backgroundPosition: "100% 100%" }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden py-3 px-6 font-semibold rounded-full text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl backdrop-blur-lg border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
            Log In
        </motion.button>
    );
};

export default LoginButton;