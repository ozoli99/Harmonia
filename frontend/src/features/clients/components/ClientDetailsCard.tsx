import React, { useMemo } from "react";
import {
    CalendarIcon,
    MailIcon,
    PhoneIcon,
    MessageSquare,
    BellIcon,
    BellOffIcon,
    StarIcon,
    UserIcon,
    PlusCircle,
    InfoIcon,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import clsx from "clsx";
import { Avatar, Button } from "kaida-ui";
import { Client } from "../types/client";

dayjs.extend(relativeTime);

const TAG_STYLES: Record<string, string> = {
    VIP: "bg-yellow-100 text-yellow-800",
    Frequent: "bg-blue-100 text-blue-800",
    Inactive: "bg-gray-200 text-gray-700",
};

interface Props {
    client: Client;
    onMessage: (client: Client) => void;
    onBook: (client: Client) => void;
    onToggleReminder: (client: Client) => void;
}

const ClientDetailsCard: React.FC<Props> = ({
    client,
    onMessage,
    onBook,
    onToggleReminder,
}) => {
    const lastAppointment = useMemo(
        () => client.appointmentHistory.at(-1),
        [client.appointmentHistory]
    );

    const latestFeedback = useMemo(
        () => client.feedback.at(-1),
        [client.feedback]
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Avatar
                    name={client.name}
                    avatarUrl={client.avatar}
                    size="xl"
                />
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {client.name}
                    </h3>
                    {client.tag && (
                        <span
                            className={clsx(
                                "inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize w-fit",
                                TAG_STYLES[client.tag] ||
                                    "bg-gray-100 text-gray-700"
                            )}>
                            <UserIcon className="w-3 h-3" />
                            {client.tag}
                        </span>
                    )}
                </div>
            </div>

            {/* Contact Info */}
            <section
                className="text-sm text-gray-700 dark:text-gray-300 space-y-2"
                aria-labelledby="contact-info">
                <h4
                    id="contact-info"
                    className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                    Contact Info
                </h4>
                <p className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4 text-blue-500" />
                    {client.email ? (
                        <a
                            href={`mailto:${client.email}`}
                            className="hover:underline">
                            {client.email}
                        </a>
                    ) : (
                        "No email"
                    )}
                </p>
                {client.phone && (
                    <p className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-green-500" />
                        <a
                            href={`tel:${client.phone}`}
                            className="hover:underline">
                            {client.phone}
                        </a>
                    </p>
                )}
            </section>

            {/* Appointments */}
            <section
                className="text-sm text-gray-700 dark:text-gray-300 space-y-2"
                aria-labelledby="appointment-info">
                <h4
                    id="appointment-info"
                    className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                    Appointments
                </h4>
                <p className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-purple-500" />
                    Total: {client.appointmentHistory.length}
                </p>
                {lastAppointment && (
                    <p className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        Last: {dayjs(lastAppointment.date).fromNow()} (
                        {dayjs(lastAppointment.date).format("MMM D, YYYY")})
                    </p>
                )}
            </section>

            {/* Feedback */}
            {latestFeedback && (
                <section className="bg-white dark:bg-surfaceDark border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm space-y-2">
                    <div
                        className="flex items-center gap-1 text-yellow-400"
                        aria-label={`Rating ${latestFeedback.rating} stars`}>
                        {Array.from({ length: latestFeedback.rating }).map(
                            (_, i) => (
                                <StarIcon key={i} className="w-4 h-4" />
                            )
                        )}
                    </div>
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        “{latestFeedback.comment}”
                    </p>
                    <p className="text-xs text-gray-400">
                        {dayjs(latestFeedback.date).fromNow()}
                    </p>
                </section>
            )}

            {/* Notes */}
            {client.notes && (
                <section
                    className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 px-3 py-2 rounded-md text-sm text-yellow-700 dark:text-yellow-100"
                    aria-label="Client note">
                    <InfoIcon className="w-4 h-4 inline mr-1" />
                    {client.notes}
                </section>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
                <Button
                    onClick={() => onMessage(client)}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                </Button>
                <Button
                    onClick={() => onBook(client)}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Book Appointment
                </Button>
                <Button
                    onClick={() => onToggleReminder(client)}
                    variant="ghost"
                    size="sm"
                    className={clsx(
                        "flex items-center gap-2 text-sm transition-colors",
                        client.remindersEnabled
                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                            : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900"
                    )}>
                    {client.remindersEnabled ? (
                        <>
                            <BellOffIcon className="w-4 h-4" />
                            Reminders Off
                        </>
                    ) : (
                        <>
                            <BellIcon className="w-4 h-4" />
                            Reminders On
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ClientDetailsCard;
