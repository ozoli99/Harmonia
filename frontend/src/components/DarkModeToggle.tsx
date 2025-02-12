import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const DarkModeToggle: React.FC = () => {
    const getInitialTheme = () => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) return savedTheme === "dark";
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    };

    const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full 
                        bg-gray-200 dark:bg-gray-800 shadow-md hover:shadow-lg 
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
        >
            <AnimatePresence mode="wait">
                {isDark ? (
                    <motion.div
                        key="light"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SunIcon className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dark"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MoonIcon className="w-6 h-6 text-gray-900 dark:text-gray-200" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default DarkModeToggle;