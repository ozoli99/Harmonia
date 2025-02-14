import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Client } from "../types/client";
import {
    UserIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon,
} from "@heroicons/react/24/outline";
import { useAppointmentTimer } from "../hooks/useAppointmentTimer";
import classNames from "classnames";

import ClientBadge from "./ClientBadge";
import AppointmentIndicator from "./AppointmentIndicator";
import ActionButtons from "./ActionButtons";

const trendIcons = {
    increasing: (
        <ArrowTrendingUpIcon
            className="w-6 h-6 text-green-500 drop-shadow-md"
            title="Increasing Visits"
        />
    ),
    declining: (
        <ArrowTrendingDownIcon
            className="w-6 h-6 text-red-500 drop-shadow-md"
            title="Declining Visits"
        />
    ),
    stable: (
        <MinusIcon className="w-6 h-6 text-gray-500" title="Stable Visits" />
    ),
};

export interface ClientCardProps {
    client: Client;
    openBookingModal: (client: Client) => void;
    toggleReminder: (clientId: number) => void;
    setSelectedTag: (tag: "VIP" | "Frequent" | "New") => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
    client,
    openBookingModal,
    toggleReminder,
    setSelectedTag,
}) => {
    const navigate = useNavigate();

    const nextAppointment = useMemo(
        () =>
            client.appointmentHistory.find(
                (appt) => new Date(appt.date) >= new Date()
            ) || null,
        [client.appointmentHistory]
    );

    const timeRemaining = useAppointmentTimer(
        nextAppointment ? new Date(nextAppointment.date) : null
    );

    const ratingBorderColor = useMemo(() => {
        if (!client.feedback || client.feedback.length === 0)
            return "border-gray-300";
        const avgRating =
            client.feedback.reduce((sum, item) => sum + item.rating, 0) /
            client.feedback.length;
        return avgRating >= 4 ? "border-green-500" : "border-yellow-500";
    }, [client.feedback]);

    const isTodayAppointment = useMemo(() => {
        return Boolean(
            nextAppointment &&
                new Date(nextAppointment.date).toDateString() ===
                    new Date().toDateString()
        );
    }, [nextAppointment]);

    const handleCardClick = useCallback(() => {
        navigate("/profile", { state: { client } });
    }, [navigate, client]);

    const handleLastVisitClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            navigate("/calendar");
        },
        [navigate]
    );

    const handleMessageClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            navigate("/messages", { state: { client } });
        },
        [navigate, client]
    );

    const handleAppointmentClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            openBookingModal(client);
        },
        [openBookingModal, client]
    );

    const handleBadgeClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedTag(client.tag);
        },
        [client.tag, setSelectedTag]
    );

    return (
        <motion.div
            key={client.id}
            onClick={handleCardClick}
            className="relative p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl active:scale-95"
            whileHover={{ scale: 1.02 }}>
            <AppointmentIndicator isToday={isTodayAppointment} />

            {client.tag && (
                <ClientBadge tag={client.tag} onClick={handleBadgeClick} />
            )}

            {/* Profile & Basic Info */}
            <div className="flex items-center justify-between">
                {/* Profile Image */}
                <div
                    className={classNames(
                        "relative w-16 h-16 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-md",
                        ratingBorderColor
                    )}>
                    {client.avatar ? (
                        <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <UserIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
                    )}
                </div>

                {/* Client Name & Short Info */}
                <div className="flex-1 ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {client.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        📅{" "}
                        <span
                            onClick={handleLastVisitClick}
                            className="underline cursor-pointer">
                            Last Visit: {client.lastAppointment}
                        </span>
                    </p>
                    {timeRemaining && (
                        <p className="text-blue-500 text-sm font-medium">
                            ⏳ Next: {timeRemaining}
                        </p>
                    )}
                </div>

                <ActionButtons
                    client={client}
                    onMessage={handleMessageClick}
                    onAppointment={handleAppointmentClick}
                />
            </div>
        </motion.div>
    );
};

export default React.memo(ClientCard);
