import React from "react";
import {
    CalendarCheck,
    ChevronRight,
    Bell,
    PlayCircle,
    UserPlus,
    Send,
    XIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@shared/contexts/SidebarContext";
import ClientDetailsCard from "@features/clients/components/ClientDetailsCard";
import { Button } from "kaida-ui";

interface RightSidebarProps {
    appointmentsToday: number;
    unreadMessages: number;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
    appointmentsToday,
    unreadMessages,
}) => {
    const { selectedClient, setSelectedClient, toggleReminder } = useSidebar();

    const handleMessage = () => {
        console.log("Message client:", selectedClient?.name);
    };

    const handleBook = () => {
        console.log("Book appointment for:", selectedClient?.name);
    };

    const handleToggleReminder = () => {
        if (selectedClient) toggleReminder(selectedClient);
    };

    if (selectedClient) {
        return (
            <div className="flex flex-col h-full w-full px-6 py-6 space-y-6 overflow-y-auto bg-surfaceLight dark:bg-surfaceDark rounded-l-2xl shadow-inner transition-colors">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-surfaceDark dark:text-white">
                        Client Details
                    </h2>
                    <button
                        onClick={() => setSelectedClient(null)}
                        className="text-gray-500 hover:text-red-500 transition-all">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <ClientDetailsCard
                    client={selectedClient}
                    onMessage={handleMessage}
                    onBook={handleBook}
                    onToggleReminder={handleToggleReminder}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full px-4 py-6 space-y-6 overflow-y-auto bg-surfaceLight dark:bg-surfaceDark rounded-l-2xl shadow-inner transition-colors">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-surfaceDark dark:text-white">
                    Quick Overview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Today’s snapshot of your activity
                </p>
            </div>

            {/* Appointments */}
            <div className="bg-white dark:bg-surfaceDark rounded-2xl shadow-sm border border-gray-200 dark:border-[#3B4D6B] p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5 text-primary" />
                        <h3 className="font-medium text-surfaceDark dark:text-white">
                            Appointments
                        </h3>
                    </div>
                    <span className="text-xs text-gray-500">Today</span>
                </div>
                <p className="text-sm text-gray-500">
                    You have{" "}
                    <span className="font-semibold text-primary">
                        {appointmentsToday}
                    </span>{" "}
                    session{appointmentsToday !== 1 && "s"} today
                </p>
                <Button size="sm" variant="secondary" className="w-full mt-2">
                    View Schedule
                </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-surfaceDark rounded-2xl shadow-sm border border-gray-200 dark:border-[#3B4D6B] p-4">
                <div className="sticky top-0 z-10 bg-white dark:bg-surfaceDark pb-2">
                    <h3 className="font-medium text-surfaceDark dark:text-white">
                        Quick Actions
                    </h3>
                </div>
                <ul className="space-y-2 mt-2">
                    <ActionItem
                        label="Start new appointment"
                        icon={<PlayCircle className="w-4 h-4" />}
                    />
                    <ActionItem
                        label="Invite client"
                        icon={<UserPlus className="w-4 h-4" />}
                    />
                    <ActionItem
                        label="Send reminder"
                        icon={<Send className="w-4 h-4" />}
                    />
                </ul>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-surfaceDark rounded-2xl shadow-sm border border-gray-200 dark:border-[#3B4D6B] p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-warning" />
                        <h3 className="font-medium text-surfaceDark dark:text-white">
                            Notifications
                        </h3>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    You have{" "}
                    <span className="font-semibold text-warning dark:text-warning">
                        {unreadMessages}
                    </span>{" "}
                    unread message{unreadMessages !== 1 && "s"}
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-blue-500 px-0">
                    View all
                </Button>
            </div>

            {/* Footer Info */}
            <div className="mt-auto text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-[#3B4D6B] pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>All systems operational</span>
                </div>
            </div>
        </div>
    );
};

const ActionItem: React.FC<{ label: string; icon: React.ReactNode }> = ({
    label,
    icon,
}) => {
    return (
        <motion.li
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
        </motion.li>
    );
};

export default RightSidebar;
