import React, { useState, useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { Button } from "kaida-ui";

const UserManagement: React.FC = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const clerk = useClerk();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isLoaded) {
        return <div className="text-sm text-gray-500">Loading...</div>;
    }

    if (!isSignedIn || !user) {
        return (
            <Button
                onClick={() => clerk.openSignIn()}
                className="relative overflow-hidden py-3 px-8 font-semibold rounded-full text-[#0C1B33] dark:text-white 
                       bg-gradient-to-r from-[#CFA15D] to-[#89AFC8] hover:from-[#C89C5D] hover:to-[#7DA1B5] 
                       shadow-lg hover:shadow-2xl backdrop-blur-md border border-[#CFA15D]/30 dark:border-[#89AFC8]/30 
                       transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CFA15D]/50"
                animated
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 15px rgba(207, 161, 93, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}>
                Log In
            </Button>
        );
    }

    const profileImage =
        (user as any).profileImageUrl ||
        user.imageUrl ||
        "https://via.placeholder.com/40";

    return (
        <div className="relative flex items-center space-x-4">
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-3 focus:outline-none">
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
                        className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all transform origin-top-right backdrop-blur-md">
                        <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-xl transition">
                            <IoPersonCircleOutline className="mr-3 text-xl" />
                            View Profile
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <IoSettingsOutline className="mr-3 text-xl" />
                            Settings
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <Button
                            onClick={() => {
                                setMenuOpen(false);
                                clerk.signOut();
                            }}
                            variant="gradient"
                            animated
                            className="w-full justify-start px-4 py-3 rounded-b-xl text-white bg-gradient-to-r from-[#E63946] to-[#F4A261] hover:from-[#D62839] hover:to-[#E76F51] border border-[#E63946]/30 dark:border-[#E63946]/50"
                            whileHover={{
                                scale: 1.05,
                                boxShadow:
                                    "0px 4px 15px rgba(230, 57, 70, 0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            icon={<FiLogOut className="text-xl" />}
                            iconPosition="left">
                            Log Out
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
