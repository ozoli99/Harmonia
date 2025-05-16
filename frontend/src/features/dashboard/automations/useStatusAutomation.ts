import { Appointment } from "@features/appointments/types/appointments";
import { useEffect } from "react";
import { statusTriggerRules } from "./rules";
import { runStatusRules } from "./engine";
import dayjs from "dayjs";
import { ScheduledStatus } from "../types/scheduledStatus";
import { Status } from "kaida-ui";

interface Options {
    appointments: Appointment[];
    currentStatus: Status;
    scheduledStatuses?: ScheduledStatus[];
    onSetStatus: (status: Status) => void;
    onSetCustomStatus: (status: string) => void;
    notify?: (message: string) => void;
}

export const useStatusAutomation = ({
    appointments,
    currentStatus,
    scheduledStatuses = [],
    onSetStatus,
    onSetCustomStatus,
    notify,
}: Options) => {
    useEffect(() => {
        const checkRules = () => {
            const now = dayjs();

            for (const scheduled of scheduledStatuses) {
                const from = dayjs(scheduled.from);
                const to = dayjs(scheduled.to);

                if (now.isAfter(from) && now.isBefore(to)) {
                    onSetCustomStatus(scheduled.status);
                    break;
                }
            }

            runStatusRules(statusTriggerRules, {
                currentTime: now,
                appointments,
                currentStatus,
                setStatus: onSetStatus,
                setCustomStatus: onSetCustomStatus,
                notify,
            });
        };

        const interval = setInterval(checkRules, 60000);
        checkRules();

        return () => clearInterval(interval);
    }, [
        appointments,
        currentStatus,
        scheduledStatuses,
        onSetStatus,
        onSetCustomStatus,
        notify,
    ]);
};
