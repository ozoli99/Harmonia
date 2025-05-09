import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Badge, Button } from "kaida-ui";
import dayjs from "dayjs";
import { StatusType } from "./StatusAvatarDropdown";
import { ScheduledStatus } from "../types/scheduledStatus";

interface Props {
    open: boolean;
    onClose: () => void;
    currentStatus: StatusType;
    customStatus: string | null;
    recent: string[];
    suggestions: string[];
    scheduled: ScheduledStatus[];
    onSelectStatus: (s: string) => void;
    onOpenCustomStatus: () => void;
}

const StatusCenterDialog: React.FC<Props> = ({
    open,
    onClose,
    currentStatus,
    customStatus,
    recent,
    suggestions,
    scheduled,
    onSelectStatus,
    onOpenCustomStatus,
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-[95vw] max-w-2xl p-6 z-50 space-y-6 overflow-y-auto max-h-[90vh] theme-panel">
                                <Dialog.Title
                                    className="text-xl font-semibold theme-heading"
                                    aria-level={1}>
                                    Status Center
                                </Dialog.Title>

                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-wide theme-subtext font-medium">
                                        Current Status
                                    </p>
                                    <Badge
                                        label={customStatus || currentStatus}
                                        variant={
                                            customStatus ? "outline" : "default"
                                        }
                                    />
                                </div>

                                {suggestions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs uppercase tracking-wide theme-subtext font-medium">
                                            Smart Suggestions
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((sug) => (
                                                <Button
                                                    key={sug}
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        onSelectStatus(sug)
                                                    }>
                                                    {sug}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recent.length > 0 && (
                                    <div className="space-y-2 border-t border-border pt-4">
                                        <p className="text-xs uppercase tracking-wide theme-subtext font-medium">
                                            Recent Statuses
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {recent.map((r) => (
                                                <Button
                                                    key={r}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        onSelectStatus(r)
                                                    }>
                                                    {r}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {scheduled.length > 0 && (
                                    <div className="space-y-2 border-t border-border pt-4">
                                        <p className="text-xs uppercase tracking-wide theme-subtext font-medium">
                                            Scheduled
                                        </p>
                                        <div className="space-y-1 text-sm theme-subtext">
                                            {scheduled.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="flex justify-between">
                                                    <span>{s.status}</span>
                                                    <span>
                                                        {dayjs(s.from).format(
                                                            "HH:mm"
                                                        )}{" "}
                                                        -{" "}
                                                        {dayjs(s.to).format(
                                                            "HH:mm"
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                                    <Button
                                        onClick={onOpenCustomStatus}
                                        variant="ghost">
                                        ✏️ Set Custom Status…
                                    </Button>
                                    <Button onClick={onClose}>Close</Button>
                                </div>
                            </motion.div>
                        </div>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default StatusCenterDialog;
