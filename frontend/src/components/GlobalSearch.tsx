import React, { useState } from "react";

interface GlobalSearchProps {
    onSearch: (query: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(query);
        }
    };

    return (
        <div className="max-w-md mx-auto my-4">
            <input
                type="text"
                placeholder="Search appointments, clients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Global Search"
            />
        </div>
    );
};

export default GlobalSearch;