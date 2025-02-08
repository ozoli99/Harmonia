import React, { useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

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

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-harmoniaGray.light dark:bg-harmoniaGray.dark text-harmoniaBlue hover:bg-harmoniaBlue hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-harmoniaBlue"
            aria-label="Toggle dark mode"
        >
            {isDark ? '🌞' : '🌜'}
        </button>
    );
};

export default DarkModeToggle;