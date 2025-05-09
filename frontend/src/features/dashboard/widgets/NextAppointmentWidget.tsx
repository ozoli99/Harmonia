import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Info } from "lucide-react";
import { Button, Avatar } from "kaida-ui";
import { cn } from "@shared/utils/ui/cn";
import * as Tooltip from "@radix-ui/react-tooltip";
import dayjs from "dayjs";

type ChecklistItem = string | { label: string; completed?: boolean };

type NextAppointmentWidgetProps = {
    clientName: string;
    clientNote?: string;
    clientAvatarUrl?: string;
    clientChecklist?: ChecklistItem[];
    startTime: Date;
    onViewDetails?: () => void;
    onMessageClient?: () => void;
    className?: string;
    shouldSpeak?: boolean;
};

const getSessionLabel = (minutes: number) => {
    if (minutes <= 0) return "Now";
    if (minutes <= 5) return "Starting Soon";
    if (minutes <= 15) return "In a few minutes";
    if (minutes < 60) return `In ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `In ${hours}h`;
};

const getPrimaryCTA = (minutes: number) => {
    if (minutes <= 0) return "Start Session";
    if (minutes <= 5) return "Greet Client";
    if (minutes <= 15) return "Prepare";
    return "View Details";
};

const formatTimeUntil = (minutes: number) => {
    if (minutes <= 0) return "now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`;
};

const getStatusClass = (minutes: number) => {
    if (minutes <= 0) return "bg-danger text-white";
    if (minutes <= 5) return "bg-warning text-black";
    return "bg-success/20 text-success";
};

const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
};

const NextAppointmentWidget: React.FC<NextAppointmentWidgetProps> = ({
    clientName,
    clientNote,
    clientAvatarUrl,
    clientChecklist = [],
    startTime,
    onViewDetails,
    onMessageClient,
    className,
    shouldSpeak = false,
}) => {
    const minutesUntil = useMemo(() => {
        const now = dayjs();
        const start = dayjs(startTime);
        return Math.round(start.diff(now, "minute"));
    }, [startTime]);

    const timeUntil = formatTimeUntil(minutesUntil);
    const isUrgent = minutesUntil <= 5;

    useEffect(() => {
        if (minutesUntil === 10 && shouldSpeak) {
            speak(`Your next client, ${clientName}, arrives in 10 minutes.`);
        }
    }, [minutesUntil, clientName, shouldSpeak]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "theme-panel p-4 rounded-xl flex flex-col sm:flex-row items-start gap-4 shadow-sm border-l-4",
                isUrgent
                    ? "border-danger animate-soft-pulse"
                    : "border-primary",
                className
            )}>
            <Avatar name={clientName} avatarUrl={clientAvatarUrl} size={40} />

            <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold theme-heading">
                        {clientName}
                    </h3>
                    <span
                        className={cn(
                            "text-xs px-2 py-0.5 rounded font-medium",
                            getStatusClass(minutesUntil)
                        )}>
                        {getSessionLabel(minutesUntil)}
                    </span>
                </div>

                <p className="text-sm theme-subtext" aria-live="polite">
                    Your next session starts in {timeUntil}.
                </p>

                {clientNote && (
                    <p className="text-xs theme-subtext italic">{clientNote}</p>
                )}

                {clientChecklist.length > 0 && (
                    <ul className="text-xs theme-subtext mt-1 space-y-0.5 pl-4 list-disc">
                        {clientChecklist.map((item, i) => {
                            const text =
                                typeof item === "string" ? item : item.label;
                            const done =
                                typeof item === "string"
                                    ? false
                                    : item.completed;
                            return (
                                <li
                                    key={i}
                                    className={cn(
                                        done && "line-through opacity-60"
                                    )}>
                                    {text}
                                </li>
                            );
                        })}
                    </ul>
                )}

                {minutesUntil > 0 && minutesUntil <= 15 && (
                    <div className="h-1 w-full bg-muted/30 rounded">
                        <div
                            className="h-full theme-kpi-progress rounded transition-all"
                            style={{
                                width: `${((15 - minutesUntil) / 15) * 100}%`,
                            }}
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onViewDetails}
                        icon={<Info className="w-4 h-4" />}>
                        {getPrimaryCTA(minutesUntil)}
                    </Button>

                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={<MessageSquare className="w-4 h-4" />}
                                    aria-label={`Message ${clientName}`}
                                    onClick={onMessageClient}
                                />
                            </Tooltip.Trigger>
                            <Tooltip.Content
                                className="theme-tooltip"
                                side="top">
                                Message {clientName}
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                </div>
            </div>
        </motion.div>
    );
};

export default NextAppointmentWidget;
