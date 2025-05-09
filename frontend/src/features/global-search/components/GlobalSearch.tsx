import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { mockData } from "../constants/globalSearch";
import { createFuse, filterResults } from "../utils/fuzzy";
import { useClickOutside } from "@shared/hooks/useClickOutside";
import SuggestionList from "../components/SuggestionList";
import { FILTER_OPTIONS } from "../constants/globalSearch";
import type { FilterOption, SearchCategory, Item } from "../types/globalSearch";
import { Layers3, CalendarDays, User, Banknote } from "lucide-react";
import { SearchBar } from "kaida-ui";

const allItems: Item[] = Object.entries(mockData).flatMap(([category, items]) =>
    items.map((item) => ({ item, category: category as SearchCategory }))
);

const fuse = createFuse(allItems);

const filterIcons: Record<FilterOption, React.ReactNode> = {
    All: <Layers3 className="w-4 h-4" />,
    Appointments: <CalendarDays className="w-4 h-4" />,
    Clients: <User className="w-4 h-4" />,
    Transactions: <Banknote className="w-4 h-4" />,
};

interface GlobalSearchProps {
    onSearch: (query: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [filter, setFilter] = useState<FilterOption>("All");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredResults, setFilteredResults] = useState<
        { category: SearchCategory; items: string[] }[]
    >([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchInputRef = useRef<HTMLDivElement | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastScrollTime = useRef<number>(0);

    useClickOutside(searchInputRef, () => {
        setShowSuggestions(false);
    });

    useEffect(() => {
        const handleSlash = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
                e.preventDefault();
                searchInputRef.current?.querySelector("input")?.focus();
            }
        };
        window.addEventListener("keydown", handleSlash);
        return () => window.removeEventListener("keydown", handleSlash);
    }, []);

    const flattenedResults = useMemo(
        () => filteredResults.flatMap((group) => group.items),
        [filteredResults]
    );

    const updateSuggestions = (input: string) => {
        const grouped = filterResults(fuse, input, filter);
        setFilteredResults(grouped);
        setSelectedIndex(grouped.flatMap((g) => g.items).length ? 0 : -1);
        setShowSuggestions(true);
    };

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            setIsLoading(true);
            if (query) {
                updateSuggestions(query);
            } else {
                setShowSuggestions(false);
                setFilteredResults([]);
                setSelectedIndex(-1);
            }
            onSearch(query);
            setIsLoading(false);
        }, 300);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [query, filter]);

    useEffect(() => {
        if (
            selectedIndex >= 0 &&
            suggestionsRef.current &&
            Date.now() - lastScrollTime.current > 100
        ) {
            lastScrollTime.current = Date.now();
            const el = suggestionsRef.current.querySelectorAll(
                '[role="option"]'
            )[selectedIndex] as HTMLElement;
            el?.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!flattenedResults.length) return;
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % flattenedResults.length);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex(
                (prev) =>
                    (prev - 1 + flattenedResults.length) %
                    flattenedResults.length
            );
        } else if (e.key === "Enter" && selectedIndex !== -1) {
            const selected = flattenedResults[selectedIndex];
            if (selected) handleSelect(selected);
        } else if (e.key === "Escape") {
            resetSearch();
        }
    };

    const handleSelect = (value: string) => {
        setQuery(value);
        setShowSuggestions(false);
        onSearch(value);
        setRecentSearches((prev) =>
            [value, ...prev.filter((q) => q !== value)].slice(0, 5)
        );
    };

    const resetSearch = () => {
        setQuery("");
        setFilter("All");
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    return (
        <div className="relative max-w-lg mx-auto my-6">
            <SearchBar
                query={query}
                onQueryChange={setQuery}
                onClear={resetSearch}
                selectedFilter={filter}
                onFilterChange={setFilter}
                filterOptions={FILTER_OPTIONS}
                icons={filterIcons}
            />

            <AnimatePresence>
                {showSuggestions && (
                    <SuggestionList
                        loading={isLoading}
                        results={filteredResults}
                        selectedIndex={selectedIndex}
                        flattenedResults={flattenedResults}
                        onSelect={handleSelect}
                        onHover={setSelectedIndex}
                        recent={recentSearches}
                        query={query}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlobalSearch;
