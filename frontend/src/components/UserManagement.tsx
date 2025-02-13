import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { FiLogOut } from "react-icons/fi";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const UserManagement: React.FC = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isLoaded) {
        return <div className="text-sm text-gray-500">Loading...</div>;
    }

    if (!isSignedIn || !user) {
        return <LoginButton />;
    }

    const profileImage = (user as any).profileImageUrl || user.imageUrl || "https://via.placeholder.com/40";

    return (
        <div className="relative flex items-center space-x-4">
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-3 focus:outline-none"
                >
                    <div className="relative">
                        <img
                            src={profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 shadow-md transition-transform transform hover:scale-105"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                </button>

                {menuOpen && (
                    <motion.div 
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all transform origin-top-right backdrop-blur-md"
                    >
                        <Link 
                            to="/profile" 
                            className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-xl transition"
                        >
                            <IoPersonCircleOutline className="mr-3 text-xl" />
                            View Profile
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <Link 
                            to="/profile" 
                            className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <IoSettingsOutline className="mr-3 text-xl" />
                            Settings
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-b-xl transition"
                        >
                            <FiLogOut className="mr-3 text-xl" />
                            <LogoutButton />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;