import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { categoryIcons } from "../constants/globalSearch";
import { SearchCategory } from "../types/globalSearch";
import { motion } from "framer-motion";
import React from "react";
import { Spinner } from "kaida-ui";

interface Props {
    loading: boolean;
    results: { category: SearchCategory; items: string[] }[];
    selectedIndex: number;
    flattenedResults: string[];
    onSelect: (val: string) => void;
    onHover: (index: number) => void;
    recent: string[];
    query: string;
}

const SuggestionList: React.FC<Props> = ({
    loading,
    results,
    selectedIndex,
    flattenedResults,
    onSelect,
    onHover,
    recent,
    query,
}) => {
    return (
        <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 mt-2 w-full max-h-80 bg-white dark:bg-[#1A2A4A] shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto z-50">
            {loading ? (
                <div className="px-4 py-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                    <Spinner /> Searching...
                </div>
            ) : results.length ? (
                results.map((group) => {
                    const Icon = categoryIcons[group.category];
                    return (
                        <div key={group.category}>
                            <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                {group.category}
                            </div>
                            {group.items.map((item) => {
                                const index = flattenedResults.indexOf(item);
                                const isSelected = selectedIndex === index;
                                return (
                                    <div
                                        key={item}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseEnter={() => onHover(index)}
                                        onClick={() => onSelect(item)}
                                        className={`px-4 py-3 md:py-2 text-base md:text-sm min-h-[48px] flex items-center cursor-pointer transition-all ${
                                            isSelected
                                                ? "bg-[#CFA15D] text-white"
                                                : "hover:bg-[#CFA15D] hover:text-white text-gray-700 dark:text-gray-300"
                                        }`}>
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })
            ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 flex justify-between items-center">
                    No results found.
                    <button className="flex items-center text-sm text-blue-600 hover:underline">
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Create new client
                    </button>
                </div>
            )}

            {recent.length > 0 && !query && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                        Recent Searches
                    </div>
                    {recent.map((item, i) => (
                        <div
                            key={item + i}
                            role="option"
                            onClick={() => onSelect(item)}
                            className="px-4 py-3 flex items-center cursor-pointer transition-all hover:bg-[#CFA15D] hover:text-white text-gray-700 dark:text-gray-300">
                            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default SuggestionList;
