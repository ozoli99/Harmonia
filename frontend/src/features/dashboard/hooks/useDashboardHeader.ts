import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { useUser } from "@clerk/clerk-react";
import type { Appointment } from "@features/appointments/types/appointments";
import { useStatusAutomation } from "../automations/useStatusAutomation";
import type { ScheduledStatus } from "../types/scheduledStatus";
import { getGreeting, getSmartSuggestions, isStatus } from "../utils/timeUtils";
import { Status } from "kaida-ui";

export interface UseDashboardHeaderProps {
    appointments: Appointment[];
    scheduledStatuses: ScheduledStatus[];
    timelineStartHour: number;
    timelineEndHour: number;
}

export const useDashboardHeader = ({
    appointments,
    scheduledStatuses,
    timelineStartHour,
    timelineEndHour,
}: UseDashboardHeaderProps) => {
    const { user } = useUser();

    const [today, setToday] = useState(() =>
        dayjs().format("dddd, MMMM D, YYYY")
    );
    const [greeting, setGreeting] = useState(getGreeting());

    const [currentStatus, setCurrentStatus] = useState<Status>("Available");
    const [customStatus, setCustomStatus] = useState<string | null>(null);
    const [customExpiry, setCustomExpiry] = useState<number | null>(null);
    const [recentStatuses, setRecentStatuses] = useState<string[]>([]);

    const [timelineRange, setTimelineRange] = useState<[number, number]>([
        timelineStartHour,
        timelineEndHour,
    ]);

    const [isStatusDialogOpen, setStatusDialogOpen] = useState(false);
    const [isStatusCenterOpen, setStatusCenterOpen] = useState(false);

    const [tempStatus, setTempStatus] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        const stored = user?.publicMetadata?.customStatus as string | undefined;
        if (stored) setCustomStatus(stored);
    }, [user]);

    // Update date & greeting every minute
    useEffect(() => {
        const id = setInterval(() => {
            setToday(dayjs().format("dddd, MMMM D, YYYY"));
            setGreeting(getGreeting());
        }, 60_000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("timelineRange");
        if (saved) {
            const parsed = JSON.parse(saved) as [number, number];
            if (parsed[0] < parsed[1] && parsed[0] >= 0 && parsed[1] <= 24) {
                setTimelineRange(parsed);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("timelineRange", JSON.stringify(timelineRange));
    }, [timelineRange]);

    const evaluateTriggers = useCallback(() => {
        if (customStatus) return;

        const now = dayjs();
        const upcoming = appointments
            .filter((a) => dayjs(`${a.date}T${a.startTime}`).isAfter(now))
            .sort((a, b) =>
                dayjs(`${a.date}T${a.startTime}`).diff(
                    dayjs(`${b.date}T${b.startTime}`)
                )
            )[0];
        const recent = appointments
            .filter((a) => dayjs(`${a.date}T${a.endTime}`).isBefore(now))
            .sort((a, b) =>
                dayjs(`${b.date}T${b.endTime}`).diff(
                    dayjs(`${a.date}T${a.endTime}`)
                )
            )[0];

        const gapNext = upcoming
            ? dayjs(`${upcoming.date}T${upcoming.startTime}`).diff(
                  now,
                  "minute"
              )
            : Infinity;
        const sinceLast = recent
            ? now.diff(dayjs(`${recent.date}T${recent.endTime}`), "minute")
            : Infinity;

        if (gapNext >= 120 && currentStatus !== "Available") {
            setCurrentStatus("Available");
            setCustomStatus("Admin block");
        }
        if (sinceLast >= 180 && currentStatus !== "Available") {
            setCurrentStatus("Available");
            setCustomStatus("Deep work");
        }
    }, [appointments, customStatus, currentStatus]);

    useEffect(() => {
        const id = setInterval(evaluateTriggers, 5 * 60 * 1000);
        return () => clearInterval(id);
    }, [evaluateTriggers]);

    // Custom expiry
    useEffect(() => {
        if (!customExpiry) return;
        const id = setInterval(() => {
            if (Date.now() > customExpiry) {
                setCustomStatus(null);
                setCustomExpiry(null);
                setCurrentStatus("Available");
            }
        }, 10_000);
        return () => clearInterval(id);
    }, [customExpiry]);

    // Auto Busy when in session
    useEffect(() => {
        const now = dayjs();
        const inSession = appointments.some((a) => {
            const start = dayjs(`${a.date}T${a.startTime}`).subtract(
                5,
                "minute"
            );
            const end = dayjs(`${a.date}T${a.endTime}`);
            return now.isBetween(start, end, null, "()");
        });
        if (inSession && currentStatus !== "Busy") {
            setCurrentStatus("Busy");
            if (!customStatus) setCustomStatus("In session");
        } else if (!inSession && currentStatus === "Busy") {
            setCurrentStatus("Available");
        }
    }, [appointments, customStatus, currentStatus]);

    useStatusAutomation({
        appointments,
        currentStatus,
        scheduledStatuses,
        onSetStatus: setCurrentStatus,
        onSetCustomStatus: setCustomStatus,
    });

    const handleSaveCustom = (statusText: string) => {
        setCustomStatus(statusText);
        setCustomExpiry(Date.now() + 60 * 60 * 1000);
        setRecentStatuses((prev) =>
            [statusText, ...prev.filter((s) => s !== statusText)].slice(0, 3)
        );
        setTempStatus("");
        setStatusDialogOpen(false);
    };

    return {
        today,
        greeting,
        currentStatus,
        customStatus,
        recentStatuses,
        tempStatus,
        showEmojiPicker,
        timelineRange,
        isStatusDialogOpen,
        isStatusCenterOpen,

        // Utils
        getSmartSuggestions,
        isStatus,

        // Setters
        setStatusDialogOpen,
        setStatusCenterOpen,
        setTempStatus,
        setShowEmojiPicker,
        setTimelineRange,
        handleSaveCustom,
    };
};
