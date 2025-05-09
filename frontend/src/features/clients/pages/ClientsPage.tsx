import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import useDebounce from "@shared/hooks/useDebounce";
import { useClients } from "../hooks/useClients";
import { useSidebar } from "@shared/contexts/SidebarContext";

import ClientCard from "../components/ClientCard";
import StatCard from "../components/StatCard";
import { ClientTag, TAG_OPTIONS } from "../types/client";
import { UsersIcon, Sparkles, Repeat, Clock } from "lucide-react";
import { LayoutToggle, SearchBar, SortOption, SortSelect } from "kaida-ui";
import { sortOptions } from "../constants/clients";

type LayoutOption = "grid" | "list";

const tagIcons: Partial<Record<ClientTag, React.ReactNode>> = {
    All: <UsersIcon className="w-4 h-4" />,
    VIP: <Sparkles className="w-4 h-4" />,
    Frequent: <Repeat className="w-4 h-4" />,
    Inactive: <Clock className="w-4 h-4" />,
};

type SortValue = (typeof sortOptions)[number]["value"];

const ClientsPage: React.FC = () => {
    const {
        searchTerm,
        setSearchTerm,
        selectedTag,
        setSelectedTag,
        sortOption,
        setSortOption,
        sortedClients,
        sendMessage,
        setShowBookingModal,
    } = useClients();

    const { setSelectedClient } = useSidebar();

    const [inputValue, setInputValue] = useState(searchTerm);
    const [layout, setLayout] = useState<LayoutOption>(
        () => (localStorage.getItem("layout") as LayoutOption) || "grid"
    );
    const [sort, setSort] = useState<SortValue>(() => {
        const saved = localStorage.getItem("sortOption");
        return (saved as SortValue) ?? "Last Appointment";
    });

    const debouncedInputValue = useDebounce(inputValue, 300);

    const clearSearch = () => {
        setInputValue("");
        setSearchTerm("");
    };

    useEffect(() => {
        setSearchTerm(debouncedInputValue);
    }, [debouncedInputValue]);

    useEffect(() => {
        setSortOption(sort);
        localStorage.setItem("sortOption", sort);
    }, [sort]);

    useEffect(() => {
        localStorage.setItem("layout", layout);
    }, [layout]);

    const filteredClients = useMemo(() => {
        const base =
            selectedTag === "All"
                ? sortedClients
                : sortedClients.filter((c) => c.tag === selectedTag);

        switch (sort) {
            case "Name":
                return [...base].sort((a, b) => a.name.localeCompare(b.name));
            case "Frequency":
                return [...base].sort((a, b) =>
                    a.tag === "VIP" ? -1 : b.tag === "VIP" ? 1 : 0
                );
            default:
                return base;
        }
    }, [sortedClients, selectedTag, sort]);

    const openBookingModal = useCallback(
        (client: any) => {
            setSelectedClient(client);
            setShowBookingModal(true);
        },
        [setSelectedClient, setShowBookingModal]
    );

    const countClientsByTag = (tag: ClientTag) =>
        tag === "All"
            ? sortedClients.length
            : sortedClients.filter((c) => c.tag === tag).length;

    return (
        <div className="p-8 py-20 min-h-screen bg-gradient-to-br from-[#FDFCFB] to-[#F5F5F5] dark:from-[#0C1B33] dark:to-[#1A2A4A] text-gray-900 dark:text-white transition-all duration-500">
            {/* Header */}
            <motion.header
                className="max-w-4xl mx-auto text-center mb-12"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            staggerChildren: 0.15,
                            delayChildren: 0.2,
                            ease: "easeOut",
                        },
                    },
                }}>
                <motion.h1
                    className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white drop-shadow-sm"
                    variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                    }}>
                    🌟 Meet Your Clients
                </motion.h1>

                <motion.p
                    className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300"
                    variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                    }}>
                    Manage loyal relationships, track sessions, and keep your
                    client base strong.
                </motion.p>
            </motion.header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-5xl mx-auto">
                {["Total Clients", "VIP", "Frequent", "Inactive"].map(
                    (title) => (
                        <StatCard
                            key={title}
                            title={title}
                            value={
                                title === "Total Clients"
                                    ? sortedClients.length
                                    : sortedClients.filter(
                                          (c) => c.tag === title
                                      ).length
                            }
                        />
                    )
                )}
            </div>

            {/* Search + FilterChips */}
            <SearchBar<ClientTag>
                query={inputValue}
                onQueryChange={setInputValue}
                onClear={clearSearch}
                selectedFilter={selectedTag}
                onFilterChange={setSelectedTag}
                filterOptions={TAG_OPTIONS}
                icons={tagIcons}
            />

            {/* Sort + Layout (optional: separate component) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 max-w-7xl mx-auto">
                <SortSelect
                    value={sort}
                    onChange={(value) => setSort(value)}
                    options={[...sortOptions] as SortOption<SortValue>[]}
                    label="Sort by"
                />

                <LayoutToggle layout={layout} onChange={setLayout} />
            </div>

            {/* Client List */}
            <div
                className={clsx(
                    layout === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                )}>
                <AnimatePresence>
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <motion.div
                                key={client.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}>
                                <ClientCard
                                    client={client}
                                    layout={layout}
                                    onView={setSelectedClient}
                                    onMessage={(c) => sendMessage(c.id)}
                                    onBook={openBookingModal}
                                    setSelectedTag={setSelectedTag}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center mt-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                No clients found.
                            </p>
                            <div className="mt-4 flex justify-center gap-2">
                                <button
                                    onClick={() => setSelectedTag("All")}
                                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                    Clear Filters
                                </button>
                                <button className="px-4 py-2 text-sm bg-[#CFA15D] text-white rounded hover:bg-[#b68c4f]">
                                    Add New Client
                                </button>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ClientsPage;
