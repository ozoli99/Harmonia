import React from "react";
import { Badge, Button, Status, Dialog } from "kaida-ui";
import dayjs from "dayjs";
import { ScheduledStatus } from "../types/scheduledStatus";

interface Props {
    open: boolean;
    onClose: () => void;
    currentStatus: Status;
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
        <Dialog
            open={open}
            onOpenChange={onClose}
            contentClassName="p-6 w-[95vw] max-w-2xl max-h-[90vh]">
            <Dialog.Title className="text-xl font-semibold theme-heading">
                Status Center
            </Dialog.Title>

            {/* Current Status */}
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide theme-subtext font-medium">
                    Current Status
                </p>
                <Badge
                    label={customStatus || currentStatus}
                    variant={customStatus ? "outline" : "default"}
                />
            </div>

            {/* Smart Suggestions */}
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
                                onClick={() => onSelectStatus(sug)}>
                                {sug}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Statuses */}
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
                                onClick={() => onSelectStatus(r)}>
                                {r}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Scheduled Statuses */}
            {scheduled.length > 0 && (
                <div className="space-y-2 border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide theme-subtext font-medium">
                        Scheduled
                    </p>
                    <div className="space-y-1 text-sm theme-subtext">
                        {scheduled.map((s, i) => (
                            <div key={i} className="flex justify-between">
                                <span>{s.status}</span>
                                <span>
                                    {dayjs(s.from).format("HH:mm")} -{" "}
                                    {dayjs(s.to).format("HH:mm")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                <Button onClick={onOpenCustomStatus} variant="ghost">
                    ✏️ Set Custom Status…
                </Button>
                <Button onClick={onClose}>Close</Button>
            </div>
        </Dialog>
    );
};

export default StatusCenterDialog;
