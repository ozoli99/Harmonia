import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiX } from "react-icons/hi";

const Navbar: React.FC = () => {
    const { isSignedIn } = useUser();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-md py-3"
                    : "backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 shadow-sm py-5"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                >
                    Harmonia
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    {isSignedIn && (
                        <>
                            <Link
                                to="/dashboard"
                                className="relative text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                            >
                                Dashboard
                                <motion.span
                                    className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400 scale-x-0"
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>

                            <Link
                                to="/appointments"
                                className="relative text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                            >
                                Appointments
                                <motion.span
                                    className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400 scale-x-0"
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>

                            <Link
                                to="/clients"
                                className="relative text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                            >
                                Clients
                                <motion.span
                                    className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400 scale-x-0"
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        </>
                    )}
                    <DarkModeToggle />
                    <UserManagement />
                </div>

                <button
                    className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg px-6 py-4"
                    >
                        {isSignedIn && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="block text-gray-600 dark:text-gray-200 py-2 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/appointments"
                                    className="block text-gray-600 dark:text-gray-200 py-2 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Appointments
                                </Link>
                                <Link
                                    to="/clients"
                                    className="block text-gray-600 dark:text-gray-200 py-2 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Clients
                                </Link>
                                <div className="border-t border-gray-300 dark:border-gray-700 my-3"></div>
                            </>
                        )}
                        <DarkModeToggle />
                        <UserManagement />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;