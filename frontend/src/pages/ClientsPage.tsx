import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import ClientCard from "../components/ClientCard";
import ClientDetailsModal from "../components/ClientDetailsModal";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useClients } from "../hooks/useClients";
import useDebounce from "../hooks/useDebounce";

const ClientsPage: React.FC = () => {
    const {
        searchTerm,
        setSearchTerm,
        selectedClient,
        setSelectedClient,
        selectedTag,
        setSelectedTag,
        sortOption,
        setSortOption,
        showFilters,
        setShowFilters,
        showRecurringModal,
        setShowRecurringModal,
        showBookingModal,
        setShowBookingModal,
        toggleReminder,
        addStaffNote,
        sendMessage,
        submitFeedback,
        sortedClients
    } = useClients();

    const [inputValue, setInputValue] = useState(searchTerm);
    const debouncedInputValue = useDebounce(inputValue, 300);

    useEffect(() => {
        setSearchTerm(debouncedInputValue);
    }, [debouncedInputValue, setSearchTerm]);

    const filteredClients = selectedTag === "All"
        ? sortedClients
        : sortedClients.filter(client => client.tag === selectedTag);

    const openBookingModal = (client: any) => {
        setSelectedClient(client);
        setShowBookingModal(true);
    };
    
    return (
        <div className="p-8 py-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                🏆 Clients
            </h2>

            {/* Search Bar & Tag Filter Display */}
            <div className="relative max-w-lg mx-auto mb-6 flex items-center gap-4">
                <div className="relative w-full">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-800/80 backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    {inputValue && (
                        <button
                            onClick={() => {
                                setInputValue("");
                                setSearchTerm("");
                            }}
                            aria-label="Clear search"
                            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {selectedTag !== "All" && (
                    <motion.div 
                        className={`flex items-center gap-2 top-1 left-1 text-xs px-3 py-1 rounded-full text-white shadow-lg z-10
                            ${selectedTag === "VIP" ? "bg-yellow-500/90" : selectedTag === "Frequent" ? "bg-green-500/90" : "bg-blue-500/90"}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {selectedTag}
                        <button 
                            onClick={() => setSelectedTag("All")} 
                            className="hover:text-red-300 transition-all"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Client Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredClients.map(client => (
                    <ClientCard 
                        key={client.id} 
                        client={client} 
                        openBookingModal={openBookingModal}
                        toggleReminder={toggleReminder}
                        setSelectedTag={setSelectedTag}
                    />
                ))}
            </div>

            {/* Client Details Modal */}
            {selectedClient && (
                <ClientDetailsModal />
            )}

            {showBookingModal && (
                <Modal isOpen={true} onClose={() => setShowBookingModal(false)}>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Schedule Appointment</h3>
                        <p className="text-gray-500 dark:text-gray-400">Client: {selectedClient?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">Email: {selectedClient?.email}</p>
                        {/* More fields for date, time, and service selection */}
                    </div>
                </Modal>
            )}

            {showRecurringModal && (
                <Modal isOpen={true} onClose={() => setShowRecurringModal(false)}>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Recurring Appointments</h3>
                        <p className="text-gray-500 dark:text-gray-400">Client: {selectedClient?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">Next Appointment: {selectedClient?.appointmentHistory.find(a => a.status === "Upcoming")?.date || "None"}</p>
                        {/* Add options to reschedule, cancel, or update */}
                    </div>
                </Modal>
            )}

            <Tooltip id="trend" />
        </div>
    );
};

export default ClientsPage;
