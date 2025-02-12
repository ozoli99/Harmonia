import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";

const HeroSection: React.FC = () => (
    <section className="relative flex-1 flex flex-col items-center justify-center text-center py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
            <motion.div 
                className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[85vw] h-[85vh] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0)_80%)] opacity-50 blur-[120px]"
                animate={{ opacity: [0.4, 0.5, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>

        <motion.h1
            className="text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-[#8ea6ff] dark:via-[#ccd6ff] dark:to-[#93c5fd] drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            Elevate Your <span className="text-[#6366F1] dark:text-[#A78BFA]">Wellness</span> Business
        </motion.h1>

        <motion.p
            className="mt-6 text-xl opacity-90 max-w-3xl mx-auto text-gray-800 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
            Harmonia empowers wellness professionals with seamless scheduling, secure payments, and effortless client management.
        </motion.p>

        <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
            <Link to="/login">
                <Button className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] hover:from-[#4F46E5] hover:to-[#7E22CE] text-white font-semibold px-10 py-5 rounded-full shadow-2xl transition-all transform hover:scale-105">
                    Get Started
                </Button>
            </Link>
            <Link to="/learn-more">
                <Button className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-10 py-5 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    Learn More
                </Button>
            </Link>
        </motion.div>
    </section>
);

export default HeroSection;