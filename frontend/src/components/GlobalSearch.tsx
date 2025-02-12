import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, FunnelIcon, CheckIcon } from "@heroicons/react/24/outline";

interface GlobalSearchProps {
    onSearch: (query: string) => void;
}

type SearchCategory = "Appointments" | "Clients" | "Transactions";

const mockData = {
    Appointments: ["Upcoming Appointments", "Past Appointments", "Canceled Appointments"],
    Clients: ["John Doe", "Jane Smith", "Robert Brown"],
    Transactions: ["Invoice #1234", "Pending Payment #5678", "Refund #91011"]
};

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [filteredResults, setFilteredResults] = useState<{ category: SearchCategory; items: string[] }[]>([]);
    const [filter, setFilter] = useState<SearchCategory | "All">("All");
    const [showFilters, setShowFilters] = useState(false);
    const searchInputRef = useRef<HTMLDivElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    const debounceSearch = useCallback((q: string) => {
        const timeout = setTimeout(() => {
            onSearch(q);
        }, 300);
        return () => clearTimeout(timeout);
    }, [onSearch]);

    useEffect(() => {
        if (query) {
            setShowSuggestions(true);
            setFilteredResults(
                Object.entries(mockData)
                    .map(([category, items]) => ({
                        category: category as SearchCategory,
                        items: items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                    }))
                    .filter((group) => group.items.length > 0)
                    .filter((group) => filter === "All" || group.category === filter)
            );
        } else {
            setShowSuggestions(false);
        }
        debounceSearch(query);
    }, [query, filter, debounceSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (filteredResults.length === 0) return;

        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev === null || prev === getTotalResults() - 1 ? 0 : prev + 1));
        }
        if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev === null || prev === 0 ? getTotalResults() - 1 : prev - 1));
        }
        if (e.key === "Enter" && selectedIndex !== null) {
            const selected = getFlattenedResults()[selectedIndex];
            if (selected) {
                setQuery(selected);
                setShowSuggestions(false);
                onSearch(selected);
            }
        }
    };

    const getTotalResults = () => filteredResults.reduce((acc, group) => acc + group.items.length, 0);
    const getFlattenedResults = () => filteredResults.flatMap((group) => group.items);

    return (
        <div className="relative max-w-lg mx-auto my-6 py-16">
            <div className="relative flex items-center w-full" ref={searchInputRef}>
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search appointments, clients..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full p-3 pl-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/80 text-gray-900 dark:text-white 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all backdrop-blur-md"
                        aria-label="Global Search"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>

                <button
                    ref={filterButtonRef}
                    className="ml-3 flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FunnelIcon className="w-5 h-5" />
                    {filter}
                </button>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                            style={{
                                top: filterButtonRef.current
                                    ? filterButtonRef.current.getBoundingClientRect().height + 8
                                    : "auto"
                            }}
                        >
                            {["All", "Appointments", "Clients", "Transactions"].map((option) => (
                                <div
                                    key={option}
                                    className={`px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all flex justify-between items-center ${
                                        filter === option ? "bg-blue-500 text-white" : ""
                                    }`}
                                    onClick={() => {
                                        setFilter(option as SearchCategory | "All");
                                        setShowFilters(false);
                                    }}
                                >
                                    {option}
                                    {filter === option && <CheckIcon className="w-4 h-4" />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showSuggestions && filteredResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-2 border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        style={{
                            width: searchInputRef.current
                                ? searchInputRef.current.getBoundingClientRect().width
                                : "auto"
                        }}
                    >
                        {filteredResults.map((group, groupIndex) => (
                            <div key={group.category}>
                                <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                    {group.category}
                                </div>
                                {group.items.map((item, itemIndex) => {
                                    const overallIndex = groupIndex === 0 ? itemIndex : getFlattenedResults().indexOf(item);
                                    return (
                                        <div
                                            key={item}
                                            className={`px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all 
                                                ${selectedIndex === overallIndex ? "bg-blue-500 text-white" : ""}`}
                                            onMouseEnter={() => setSelectedIndex(overallIndex)}
                                            onClick={() => {
                                                setQuery(item);
                                                setShowSuggestions(false);
                                                onSearch(item);
                                            }}
                                        >
                                            {item}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlobalSearch;