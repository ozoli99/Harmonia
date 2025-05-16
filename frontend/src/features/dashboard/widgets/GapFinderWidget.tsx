import React, { useMemo } from "react";
import {
    CalendarClock,
    Coffee,
    ClipboardList,
    Plus,
    MoreVertical,
    X,
} from "lucide-react";
import { Button } from "kaida-ui";
import { motion } from "framer-motion";
import { cn } from "@shared/utils/ui/cn";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useGapSuggestions } from "../hooks/useGapSuggestions";
import type { Appointment } from "@features/appointments/types/appointments";
import dayjs from "dayjs";

type ActionType = "book" | "break" | "admin";

const stripe = (actionType: ActionType) =>
    actionType === "book"
        ? "border-l-primary"
        : actionType === "break"
        ? "border-l-warning"
        : "border-l-secondary";

const actionMeta: Record<
    ActionType,
    {
        label: string;
        icon: React.ReactNode;
        helper: string;
    }
> = {
    book: {
        label: "Book a Client",
        icon: <Plus className="w-4 h-4" />,
        helper: "Fill this gap with a session.",
    },
    break: {
        label: "Take a Break",
        icon: <Coffee className="w-4 h-4" />,
        helper: "Recharge before the next session.",
    },
    admin: {
        label: "Plan Follow‑up",
        icon: <ClipboardList className="w-4 h-4" />,
        helper: "Catch up on notes or admin work.",
    },
};

const pillColour = (actionType: ActionType) =>
    actionType === "book"
        ? "bg-primary/20 text-primary"
        : actionType === "break"
        ? "bg-warning/20 text-warning"
        : "bg-secondary/20 text-secondary";

const AvatarBadge: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
        {icon}
    </div>
);

type GapFinderWidgetProps = {
    gapStart: string;
    gapEnd: string;
    duration?: string;
    appointments: Appointment[];
    minDurationMins?: number;
    suggestedAction?: ActionType;
    onBookClient?: () => void;
    onTakeBreak?: () => void;
    onPlanAdmin?: () => void;
    onDismiss?: () => void;
    className?: string;
};

const GapFinderWidget: React.FC<GapFinderWidgetProps> = ({
    gapStart,
    gapEnd,
    duration,
    appointments,
    minDurationMins = 30,
    suggestedAction = "book",
    onBookClient,
    onTakeBreak,
    onPlanAdmin,
    onDismiss,
    className,
}) => {
    const minutes = useMemo(() => {
        const start = dayjs(`2025-01-01T${gapStart}`);
        const end = dayjs(`2025-01-01T${gapEnd}`);
        return end.diff(start, "minute");
    }, [gapStart, gapEnd]);

    if (minutes < minDurationMins) return null;

    const suggestions = useMemo(
        () => useGapSuggestions(gapStart, gapEnd, appointments),
        [gapStart, gapEnd, appointments]
    );

    const actions: Record<ActionType, (() => void) | undefined> = {
        book: onBookClient,
        break: onTakeBreak,
        admin: onPlanAdmin,
    };

    const { label, icon, helper } = actionMeta[suggestedAction];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={cn(
                "p-3 rounded-xl shadow-sm border-l-4 cursor-pointer select-none overflow-hidden",
                stripe(suggestedAction),
                className
            )}>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="absolute top-2 right-2 text-text-muted hover:text-text focus:outline-none"
                    aria-label="Dismiss gap card">
                    <X className="w-4 h-4" />
                </button>
            )}

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <AvatarBadge icon={<CalendarClock className="w-5 h-5" />} />

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{helper}</h3>

                            <span
                                className={cn(
                                    "text-xs px-2 py-[1px] rounded-full font-semibold",
                                    pillColour(suggestedAction)
                                )}>
                                {duration ??
                                    `${Math.round(minutes / 60)} hour${
                                        minutes >= 120 ? "s" : ""
                                    }`}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-subtle mt-0.5">
                            {gapStart} – {gapEnd}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        size="sm"
                        variant="ghost"
                        icon={icon}
                        onClick={(e) => {
                            e.stopPropagation();
                            actions[suggestedAction]?.();
                        }}>
                        {label}
                    </Button>

                    <Dropdown.Root>
                        <Dropdown.Trigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                icon={<MoreVertical className="w-4 h-4" />}
                                aria-label="More options"
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-60 hover:opacity-100"
                            />
                        </Dropdown.Trigger>
                        <Dropdown.Content
                            align="end"
                            sideOffset={4}
                            className="w-44 py-1 rounded-md shadow-lg bg-white dark:bg-slate-800
                         border border-border/20 focus:outline-none z-50">
                            {(["book", "break", "admin"] as const)
                                .filter((k) => k !== suggestedAction)
                                .map((k) => (
                                    <Dropdown.Item
                                        key={k}
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            actions[k]?.();
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700
                               dark:text-slate-200 cursor-pointer transition-colors
                               hover:bg-accent/10 hover:text-foreground focus:outline-none">
                                        {actionMeta[k].icon}
                                        {actionMeta[k].label}
                                    </Dropdown.Item>
                                ))}
                        </Dropdown.Content>
                    </Dropdown.Root>
                </div>
            </div>
        </motion.div>
    );
};

export default GapFinderWidget;
