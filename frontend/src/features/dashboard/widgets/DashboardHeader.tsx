import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useUser } from "@clerk/clerk-react";
import { useDarkMode } from "@shared/contexts/DarkModeContext";
import TimelineBar from "@features/appointments/components/TimelineBar";
import NextAppointmentWidget from "./NextAppointmentWidget";
import GapFinderWidget from "./GapFinderWidget";
import { Appointment } from "@features/appointments/types/appointments";
import TopControls from "../components/TopControls";
import {
    StatusAvatarDropdown,
    StatusType,
} from "../components/StatusAvatarDropdown";
import GreetingBlock from "../components/GreetingBlock";
import StatusDialog from "../components/StatusDialog";
import { useStatusAutomation } from "../automations/useStatusAutomation";
import { ScheduledStatus } from "../types/scheduledStatus";
import StatusCenterDialog from "../components/StatusCenterDialog";
import { motion } from "framer-motion";
import CustomTimeRangeSelector from "../components/CustomTimeRangeSelector";
import { Button } from "kaida-ui";
import { cn } from "@shared/utils/ui/cn";

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

const isStatusType = (value: string): value is StatusType =>
    ["Available", "Busy", "Offline"].includes(value);

const getSmartSuggestions = (): string[] => {
    const hour = dayjs().hour();
    if (hour < 11) return ["Planning", "Available", "Focus time"];
    if (hour < 17) return ["In session", "Admin tasks", "Coffee break"];
    return ["Offline", "Done for today"];
};

const DashboardHeader: React.FC<{
    status?: StatusType;
    timelineAppointments: Appointment[];
    onNewAppointment?: () => void;
    onOpenCalendar?: () => void;
    onAddClient?: () => void;
    timelineStartHour?: number;
    timelineEndHour?: number;
    gaps?: any;
    peakRange?: any;
}> = ({
    status = "Available",
    onNewAppointment,
    onOpenCalendar,
    onAddClient,
    timelineAppointments = [],
    timelineStartHour = 8,
    timelineEndHour = 20,
    gaps = [],
    peakRange,
}) => {
    const { user } = useUser();
    const [today, setToday] = useState(dayjs().format("dddd, MMMM D, YYYY"));
    const [greeting, setGreeting] = useState(getGreeting());
    const [currentStatus, setCurrentStatus] = useState<StatusType>("Available");
    const [customStatus, setCustomStatus] = useState<string | null>(null);
    const [customStatusExpiry, setCustomStatusExpiry] = useState<number | null>(
        null
    );
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isStatusCenterOpen, setIsStatusCenterOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isDark, setIsDark] = useDarkMode();
    const [recentStatuses, setRecentStatuses] = useState<string[]>([]);
    const [scheduledStatuses] = useState<ScheduledStatus[]>([
        {
            status: "Busy (scheduled block)",
            from: dayjs().add(1, "minute").toISOString(),
            to: dayjs().add(10, "minute").toISOString(),
        },
    ]);
    const [timelineRange, setTimelineRange] = useState<[number, number]>([
        timelineStartHour,
        timelineEndHour,
    ]);
    const [customStart, setCustomStart] = useState<number | null>(null);
    const [customEnd, setCustomEnd] = useState<number | null>(null);
    const [isCustomRangeActive, setIsCustomRangeActive] = useState(false);

    const [startHour, endHour] = timelineRange;
    const totalTimelineMinutes = (endHour - startHour) * 60;

    useEffect(() => {
        const stored = user?.publicMetadata?.customStatus;
        if (stored) setCustomStatus(stored as string);
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setToday(dayjs().format("dddd, MMMM D, YYYY"));
            setGreeting(getGreeting());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(
            () => evaluateStatusTriggers(),
            5 * 60 * 1000
        );
        return () => clearInterval(interval);
    }, [timelineAppointments, customStatus, currentStatus]);

    useEffect(() => {
        const saved = localStorage.getItem("timelineRange");
        if (saved) {
            const [start, end] = JSON.parse(saved);
            if (start < end && start >= 0 && end <= 24) {
                setTimelineRange([start, end]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("timelineRange", JSON.stringify(timelineRange));
    }, [timelineRange]);

    useEffect(() => {
        const now = dayjs();
        const isInSession = timelineAppointments.some((appointment) => {
            const start = dayjs(`${appointment.date}T${appointment.startTime}`);
            const end = dayjs(`${appointment.date}T${appointment.endTime}`);
            return (
                now.isAfter(start.subtract(5, "minute")) && now.isBefore(end)
            );
        });
        if (isInSession && currentStatus !== "Busy") {
            setCurrentStatus("Busy");
            if (!customStatus) setCustomStatus("In session");
        } else if (!isInSession && currentStatus === "Busy") {
            setCurrentStatus("Available");
        }
    }, [timelineAppointments, customStatus, currentStatus]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (customStatusExpiry && Date.now() > customStatusExpiry) {
                setCustomStatus(null);
                setCustomStatusExpiry(null);
                if (currentStatus === "Busy") {
                    setCurrentStatus("Available");
                }
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [customStatusExpiry]);

    useStatusAutomation({
        appointments: timelineAppointments,
        currentStatus,
        scheduledStatuses,
        onSetStatus: setCurrentStatus,
        onSetCustomStatus: setCustomStatus,
    });

    const handleSaveCustomStatus = (status: string) => {
        setCustomStatus(status);
        setCustomStatusExpiry(Date.now() + 60 * 60 * 1000);
        setRecentStatuses((prev) =>
            [status, ...prev.filter((s) => s !== status)].slice(0, 3)
        );
        setTempStatus("");
        setIsStatusDialogOpen(false);
    };

    const evaluateStatusTriggers = () => {
        if (customStatus) return;
        const now = dayjs();

        const next = timelineAppointments
            .filter((a) => dayjs(`${a.date}T${a.startTime}`).isAfter(now))
            .sort((a, b) =>
                dayjs(`${a.date}T${a.startTime}`).diff(
                    dayjs(`${b.date}T${b.startTime}`)
                )
            )[0];

        const last = timelineAppointments
            .filter((a) => dayjs(`${a.date}T${a.endTime}`).isBefore(now))
            .sort((a, b) =>
                dayjs(`${b.date}T${b.endTime}`).diff(
                    dayjs(`${a.date}T${a.endTime}`)
                )
            )[0];

        const gapBeforeNext = next
            ? dayjs(`${next.date}T${next.startTime}`).diff(now, "minute")
            : Infinity;

        const timeSinceLast = last
            ? now.diff(dayjs(`${last.date}T${last.endTime}`), "minute")
            : Infinity;

        if (gapBeforeNext >= 120 && currentStatus !== "Available") {
            setCurrentStatus("Available");
            setCustomStatus("Admin block");
        }
        if (timeSinceLast >= 180 && currentStatus !== "Available") {
            setCurrentStatus("Available");
            setCustomStatus("Deep work");
        }
    };

    return (
        <div className="w-full space-y-6 pb-6 border-b border-border">
            <TopControls
                isDark={isDark}
                onToggleDark={() => setIsDark(!isDark)}
                onSearch={(query) => console.log("Search:", query)}
                onNewAppointment={onNewAppointment}
                onAddClient={onAddClient}
                onOpenCalendar={onOpenCalendar}
                notificationsCount={3}
            />

            <div className="relative flex flex-col gap-6 p-6 rounded-2xl theme-panel">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <StatusAvatarDropdown
                            userImageUrl={user?.imageUrl}
                            currentStatus={currentStatus}
                            onStatusChange={(status) => {
                                if (isStatusType(status)) {
                                    setCurrentStatus(status);
                                    setCustomStatus(null);
                                }
                            }}
                            onOpenCustomStatus={() =>
                                setIsStatusDialogOpen(true)
                            }
                            onOpenStatusCenter={() =>
                                setIsStatusCenterOpen(true)
                            }
                        />
                        <div className="flex-1 min-w-0">
                            <GreetingBlock
                                greeting={greeting}
                                today={today}
                                customStatus={customStatus}
                                userName={user?.firstName ?? undefined}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border" />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}>
                    <div className="flex flex-col gap-2 text-sm font-medium text-muted">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="theme-subtext">
                                Today’s Schedule ({startHour}:00–{endHour}:00)
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                {(
                                    [
                                        [6, 18, "Early Shift"],
                                        [8, 20, "Workday"],
                                        [10, 22, "Late Start"],
                                    ] as [number, number, string][]
                                ).map(([start, end, label]) => {
                                    const isActive =
                                        startHour === start && endHour === end;
                                    return (
                                        <Button
                                            key={label}
                                            size="sm"
                                            animated
                                            variant="ghost"
                                            className={cn(
                                                "rounded-md",
                                                isActive &&
                                                    "bg-accent text-white hover:bg-accentHover shadow-accent font-semibold"
                                            )}
                                            aria-pressed={isActive}
                                            onClick={() => {
                                                setTimelineRange([start, end]);
                                                setIsCustomRangeActive(false);
                                                setCustomStart(null);
                                                setCustomEnd(null);
                                            }}>
                                            {label}
                                        </Button>
                                    );
                                })}

                                <Button
                                    size="sm"
                                    animated
                                    variant="ghost"
                                    className={cn(
                                        "rounded-md",
                                        isCustomRangeActive &&
                                            "bg-accent text-white hover:bg-accentHover shadow-accent font-semibold"
                                    )}
                                    aria-pressed={isCustomRangeActive}
                                    onClick={() =>
                                        setIsCustomRangeActive(true)
                                    }>
                                    {customStart != null && customEnd != null
                                        ? `Custom (${String(
                                              customStart
                                          ).padStart(2, "0")}:00–${String(
                                              customEnd
                                          ).padStart(2, "0")}:00)`
                                        : "Custom…"}
                                </Button>
                            </div>
                        </div>

                        {isCustomRangeActive && (
                            <CustomTimeRangeSelector
                                customStart={customStart}
                                customEnd={customEnd}
                                setCustomStart={setCustomStart}
                                setCustomEnd={setCustomEnd}
                                onApply={(start, end) => {
                                    setTimelineRange([start, end]);
                                    setIsCustomRangeActive(false);
                                }}
                                onCancel={() => {
                                    setCustomStart(null);
                                    setCustomEnd(null);
                                    setIsCustomRangeActive(false);
                                }}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <NextAppointmentWidget
                            clientName="Emma Taylor"
                            startTime={new Date("2025-05-06T23:40:00")}
                            onViewDetails={() => {}}
                            onMessageClient={() => {}}
                        />
                        <GapFinderWidget
                            gapStart="14:00"
                            gapEnd="16:00"
                            duration="2 hours"
                            suggestedAction="break"
                            onBookClient={() => console.log("Book a client")}
                            onPlanAdmin={() => console.log("Plan admin block")}
                            onTakeBreak={() => console.log("Take a break")}
                        />
                    </div>
                </motion.div>

                {timelineAppointments.length > 0 && (
                    <div className="absolute left-0 right-0 bottom-0 rounded-b-2xl overflow-hidden">
                        <TimelineBar
                            appointments={timelineAppointments}
                            gaps={gaps}
                            startHour={startHour}
                            timelineMinutes={totalTimelineMinutes}
                            peakRange={peakRange}
                        />
                    </div>
                )}
            </div>

            <StatusDialog
                open={isStatusDialogOpen}
                tempStatus={tempStatus}
                showEmojiPicker={showEmojiPicker}
                isDark={isDark}
                onTempStatusChange={setTempStatus}
                onToggleEmojiPicker={() =>
                    setShowEmojiPicker((previous) => !previous)
                }
                onSave={() => {
                    if (tempStatus.trim()) {
                        handleSaveCustomStatus(tempStatus.trim());
                    }
                }}
                onClose={() => setIsStatusDialogOpen(false)}
                suggestions={getSmartSuggestions()}
                recent={recentStatuses}
                onSetSuggestion={(s) => setTempStatus(s)}
            />

            <StatusCenterDialog
                open={isStatusCenterOpen}
                onClose={() => setIsStatusCenterOpen(false)}
                currentStatus={currentStatus}
                customStatus={customStatus}
                recent={recentStatuses}
                suggestions={getSmartSuggestions()}
                scheduled={scheduledStatuses}
                onSelectStatus={handleSaveCustomStatus}
                onOpenCustomStatus={() => setIsStatusDialogOpen(true)}
            />
        </div>
    );
};

export default DashboardHeader;
