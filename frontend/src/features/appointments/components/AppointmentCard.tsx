import React, { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarIcon,
    UserIcon,
    ClockIcon,
    XCircleIcon,
    MapPinIcon,
    CreditCardIcon,
    ArrowPathIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

import useToggle from "@shared/hooks/useToggle";
import { cardAnimation, hoverAnimation } from "@shared/animations/variants";
import { Badge } from "kaida-ui";
import { statusBadgeConfig } from "@features/clients/constants/tagBadgeConfig";
import NotesSection from "@features/clients/components/NotesSection";
import { Appointment, AppointmentStatus } from "../types/appointments";
import { AppointmentFormatters } from "@shared/utils";

interface AppointmentDetailsProps {
    appointment: Appointment;
    description: string;
    isEditing: boolean;
    setDescription: (value: string) => void;
    toggleEditing: () => void;
    onUpdate: (
        id: number,
        status: AppointmentStatus,
        description?: string
    ) => void;
}

const AppointmentDetails: FC<AppointmentDetailsProps> = ({
    appointment,
    description,
    isEditing,
    setDescription,
    toggleEditing,
    onUpdate,
}) => {
    const locationText = appointment.location || "No location specified";
    const formattedTime = AppointmentFormatters.formatTime(appointment);
    const paymentStatus = appointment.metadata?.paymentStatus || "Paid";

    return (
        <motion.div
            variants={cardAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 backdrop-blur-md p-5 rounded-lg border border-borderLight dark:border-borderDark shadow-inner">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-red-500" />
                    <span>{locationText}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-[#89AFC8]" />
                    <span>{formattedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5 text-green-500" />
                    <span>Payment: {paymentStatus}</span>
                </div>
            </div>

            <NotesSection
                notes={description}
                isEditing={isEditing}
                onToggleEdit={toggleEditing}
                onChange={setDescription}
            />

            <div className="mt-5 flex justify-between">
                <button
                    className="px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-400 text-white rounded-full shadow-md flex items-center gap-2 transition-all"
                    onClick={() =>
                        onUpdate(appointment.id, "Upcoming", description)
                    }
                    aria-label="Reschedule appointment">
                    <ArrowPathIcon className="w-5 h-5" />
                    Reschedule
                </button>
                <button
                    className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-400 text-white rounded-full shadow-md flex items-center gap-2 transition-all"
                    onClick={() =>
                        onUpdate(appointment.id, "Cancelled", description)
                    }
                    aria-label="Cancel appointment">
                    <XCircleIcon className="w-5 h-5" />
                    Cancel
                </button>
            </div>
        </motion.div>
    );
};

interface AppointmentCardProps {
    appointment: Appointment;
    onUpdate: (
        id: number,
        status: AppointmentStatus,
        description?: string
    ) => void;
}

const AppointmentCard: FC<AppointmentCardProps> = ({
    appointment,
    onUpdate,
}) => {
    const [expanded, toggleExpanded] = useToggle(false);
    const [isEditing, toggleEditing] = useToggle(false);
    const [description, setDescription] = useState(appointment.notes || "");

    const status = appointment.status || "Upcoming";
    const config = statusBadgeConfig[status];
    const Icon = config.icon;
    const StatusIcon = <Icon className="w-4 h-4" />;

    useEffect(() => {
        setDescription(appointment.notes || "");
    }, [appointment.notes]);

    const formattedTime = AppointmentFormatters.formatTime(appointment);

    return (
        <motion.div
            className="relative bg-white/80 dark:bg-surfaceDark backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-borderLight dark:border-borderDark transition-all hover:shadow-2xl hover:-translate-y-1"
            {...hoverAnimation}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#CFA15D] to-[#89AFC8] rounded-t-2xl" />

            <div className="flex justify-between items-center pt-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-[#CFA15D]" />
                    {appointment.metadata?.providerName}
                </h3>
                <Badge
                    label={config.label}
                    icon={StatusIcon}
                    variant="custom"
                    colorClass={config.colorClass}
                />
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#89AFC8]" />
                <span className="font-medium">
                    {appointment.metadata?.customerName}
                </span>
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#CFA15D]" />
                {formattedTime}
            </p>

            <button
                className="mt-4 flex items-center text-[#CFA15D] dark:text-gray-200 hover:text-[#E1B877] transition-all"
                onClick={toggleExpanded}
                aria-label="Toggle appointment details">
                {expanded ? "Hide Details" : "More details"}
                <ChevronDownIcon
                    className={`w-5 h-5 ml-2 transform transition-transform ${
                        expanded ? "rotate-180" : ""
                    }`}
                />
            </button>

            <AnimatePresence>
                {expanded && (
                    <AppointmentDetails
                        appointment={appointment}
                        description={description}
                        isEditing={isEditing}
                        setDescription={setDescription}
                        toggleEditing={toggleEditing}
                        onUpdate={onUpdate}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AppointmentCard;
