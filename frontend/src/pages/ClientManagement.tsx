import React from "react";
import Modal from "../components/Modal";
import ClientCard from "../components/ClientCard";
import ClientDetailsModal from "../components/ClientDetailsModal";
import { 
    MagnifyingGlassIcon, AdjustmentsVerticalIcon, ChevronDownIcon,
    CalendarIcon, XMarkIcon, CheckIcon, BellIcon, BellSlashIcon, PencilIcon,
    PaperAirplaneIcon, StarIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useClients } from "../hooks/useClients";

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

    return (
        <div className="p-8 py-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                🏆 Clients
            </h2>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto mb-6 flex items-center gap-4">
                <div className="relative w-full">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-800/80 backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium shadow-md transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <AdjustmentsVerticalIcon className="w-5 h-5" />Filters
                </button>
            </div>

            {showFilters && (
                <motion.div 
                    className="max-w-lg mx-auto mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-between">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Filter by Category:</label>
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value as any)}
                            className="border rounded-md px-3 py-1 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="All">All</option>
                            <option value="VIP">VIP</option>
                            <option value="Frequent">Frequent</option>
                            <option value="New">New</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-3">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as any)}
                            className="border rounded-md px-3 py-1 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Last Appointment">Last Appointment</option>
                            <option value="Name">Name</option>
                            <option value="Frequency">Frequency</option>
                        </select>
                    </div>
                </motion.div>
            )}

            {/* Client Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedClients.map(client => (
                    <ClientCard key={client.id} client={client} onClick={() => setSelectedClient(client)} toggleReminder={toggleReminder} />
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
