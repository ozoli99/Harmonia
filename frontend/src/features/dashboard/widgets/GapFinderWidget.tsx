import React from "react";
import {
    CalendarClock,
    Coffee,
    ClipboardList,
    Plus,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { Button } from "kaida-ui";
import { motion } from "framer-motion";
import { cn } from "@shared/utils/ui/cn";
import * as Tooltip from "@radix-ui/react-tooltip";

type ActionType = "book" | "break" | "admin";

type CustomAction = {
    label: string;
    icon?: React.ReactNode;
    tooltip?: string;
    onClick: () => void;
};

type GapFinderWidgetProps = {
    gapStart: string;
    gapEnd: string;
    duration: string;
    suggestedAction?: ActionType;
    onBookClient?: () => void;
    onTakeBreak?: () => void;
    onPlanAdmin?: () => void;
    className?: string;
    customActions?: CustomAction[];
};

const suggestionLabelMap: Record<ActionType, CustomAction> = {
    book: {
        label: "Book a Client",
        icon: <Plus className="w-4 h-4" />,
        tooltip: "Schedule someone during this break",
        onClick: () => {},
    },
    break: {
        label: "Take a Break",
        icon: <Coffee className="w-4 h-4" />,
        tooltip: "Recharge before your next session",
        onClick: () => {},
    },
    admin: {
        label: "Plan Follow-up",
        icon: <ClipboardList className="w-4 h-4" />,
        tooltip: "Catch up on notes or admin work",
        onClick: () => {},
    },
};

const helperTextMap = {
    book: "Consider filling this gap with a session.",
    break: "Take time to recharge and reset.",
    admin: "A great moment to organize your follow-ups.",
};

const GapFinderWidget: React.FC<GapFinderWidgetProps> = ({
    gapStart,
    gapEnd,
    duration,
    suggestedAction = "book",
    onBookClient,
    onTakeBreak,
    onPlanAdmin,
    className,
    customActions = [],
}) => {
    const actions: Record<ActionType, (() => void) | undefined> = {
        book: onBookClient,
        break: onTakeBreak,
        admin: onPlanAdmin,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "theme-panel p-4 rounded-xl shadow-sm border-l-4 border-accent flex flex-col gap-3",
                className
            )}>
            <div className="flex items-center gap-2 text-sm theme-subtext">
                <CalendarClock className="w-4 h-4 shrink-0" />
                <span>
                    {gapStart} – {gapEnd}{" "}
                    <span className="hidden sm:inline">({duration})</span>
                </span>
            </div>

            <h3 className="text-base font-semibold leading-snug">
                You have a {duration} break
            </h3>

            <p className="text-xs theme-subtext flex items-center gap-1">
                <Sparkles className="w-3 h-3 shrink-0" />
                {helperTextMap[suggestedAction]}
            </p>

            <div className="mt-2">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                    {(["book", "break", "admin"] as const).map((action) => {
                        const { label, icon, tooltip } =
                            suggestionLabelMap[action];
                        const isActive = suggestedAction === action;

                        return (
                            <Tooltip.Provider key={action}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <Button
                                            size="default"
                                            variant={
                                                isActive ? "default" : "outline"
                                            }
                                            icon={icon}
                                            className={cn(
                                                "min-w-[160px] justify-start",
                                                isActive &&
                                                    "ring-2 ring-accent/40"
                                            )}
                                            onClick={actions[action]}>
                                            {label}
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                        side="top"
                                        className="text-xs bg-black text-white rounded px-2 py-1 shadow z-50">
                                        {tooltip}
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        );
                    })}

                    {customActions.map(({ label, icon, tooltip, onClick }) => (
                        <Tooltip.Provider key={label}>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Button
                                        size="default"
                                        variant="ghost"
                                        icon={
                                            icon ?? (
                                                <ArrowRight className="w-4 h-4" />
                                            )
                                        }
                                        className="min-w-[160px] justify-start"
                                        onClick={onClick}>
                                        {label}
                                    </Button>
                                </Tooltip.Trigger>
                                {tooltip && (
                                    <Tooltip.Content
                                        side="top"
                                        className="text-xs bg-black text-white rounded px-2 py-1 shadow z-50">
                                        {tooltip}
                                    </Tooltip.Content>
                                )}
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default GapFinderWidget;
