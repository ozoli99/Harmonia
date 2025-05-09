import React from "react";
import { motion } from "framer-motion";
import {
    Mail,
    MessageSquare,
    Eye,
    StickyNote,
    Quote,
    Star,
} from "lucide-react";
import dayjs from "dayjs";
import { Avatar, Button } from "kaida-ui";
import { Client } from "../types/client";

interface ClientHighlightsProps {
    client: Client;
    onMessage?: (client: Client) => void;
    onViewProfile?: (client: Client) => void;
    onAddNote?: (client: Client) => void;
}

const ClientHighlights: React.FC<ClientHighlightsProps> = ({
    client,
    onMessage,
    onViewProfile,
    onAddNote,
}) => {
    const {
        name,
        email,
        avatar,
        tag,
        age,
        notes,
        appointmentHistory,
        feedback,
        preferences,
    } = client;

    const upcoming = appointmentHistory.find(
        (a) =>
            a.status === "Upcoming" &&
            dayjs(`${a.date} ${a.startTime}`).isAfter(dayjs())
    );

    const latestFeedback = feedback?.[feedback.length - 1];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="theme-panel p-6 rounded-xl shadow-sm space-y-5 h-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Avatar name={name} avatarUrl={avatar} size="lg" />

                <div className="flex-1">
                    <h4 className="text-lg font-semibold theme-heading flex items-center gap-2">
                        {name}
                        {tag && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent dark:bg-accent/20">
                                {tag}
                            </span>
                        )}
                    </h4>
                    <p className="text-sm text-muted flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {email}
                    </p>
                </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-2 text-sm text-muted">
                <Info label="Age" value={age ?? "N/A"} />
                <Info
                    label="Massage"
                    value={preferences?.massageType || "N/A"}
                />
                <Info
                    label="Upcoming"
                    value={
                        upcoming
                            ? `${upcoming.date} @ ${upcoming.startTime}`
                            : "None"
                    }
                />
                <Info
                    label="Pressure"
                    value={preferences?.pressureLevel || "N/A"}
                />
            </div>

            {/* Feedback */}
            {latestFeedback && (
                <div className="bg-muted/10 dark:bg-muted/20 p-3 rounded-md text-sm">
                    <div className="flex items-center gap-2 mb-1 text-muted">
                        <Quote className="w-4 h-4" />
                        <span>Latest Feedback</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-muted-foreground">
                            {latestFeedback.rating}/5
                        </span>
                    </div>
                    <p className="italic text-muted-foreground">
                        “{latestFeedback.comment}”
                    </p>
                </div>
            )}

            {/* Notes */}
            <div>
                <h5 className="text-sm font-medium text-muted mb-1">Notes</h5>
                {notes ? (
                    <p className="text-sm">{notes}</p>
                ) : (
                    <p className="text-sm italic text-gray-400">
                        No notes yet.
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-muted/20 mt-2">
                <ActionButton
                    icon={<MessageSquare className="w-4 h-4" />}
                    label="Message"
                    onClick={() => onMessage?.(client)}
                />
                <ActionButton
                    icon={<Eye className="w-4 h-4" />}
                    label="View Profile"
                    onClick={() => onViewProfile?.(client)}
                />
                <ActionButton
                    icon={<StickyNote className="w-4 h-4" />}
                    label="Add Note"
                    onClick={() => onAddNote?.(client)}
                />
            </div>
        </motion.div>
    );
};

const Info = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-sm font-medium text-foreground truncate">
            {value}
        </span>
    </div>
);

const ActionButton = ({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) => (
    <Button
        onClick={onClick}
        size="sm"
        variant="ghost"
        className="flex items-center gap-2 text-sm px-3 py-1.5 hover:bg-muted/10 dark:hover:bg-muted/20">
        {icon}
        {label}
    </Button>
);

export default ClientHighlights;
