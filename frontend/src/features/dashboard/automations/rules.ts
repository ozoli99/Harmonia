import dayjs from "dayjs";
import { StatusTriggerRule } from "./types";

export const statusTriggerRules: StatusTriggerRule[] = [
    {
        id: "lunch-break",
        trigger: "timeOfDay",
        condition: ({ currentTime, appointments }) =>
            currentTime.hour() === 12 &&
            appointments.every((appointment) =>
                dayjs(`${appointment.date}T${appointment.startTime}`).isAfter(
                    currentTime
                )
            ),
        action: ({ setCustomStatus }) => {
            setCustomStatus("Lunch break");
        },
        description: "Set 'Lunch break' at 12:00 if no ongoing appointments.",
    },
    {
        id: "no-appointment-admin",
        trigger: "noAppointments",
        condition: ({ currentTime, appointments }) =>
            appointments.every((a) =>
                dayjs(`${a.date}T${a.startTime}`).isAfter(
                    currentTime.add(2, "hour")
                )
            ),
        action: ({ setCustomStatus }) => {
            setCustomStatus("Admin block");
        },
        description: "Set 'Admin block' if no appointments in next 2 hours.",
    },
    {
        id: "back-to-back-warning",
        trigger: "backToBackAppointments",
        condition: ({ appointments, currentTime }) => {
            const sorted = appointments
                .map((a) => ({
                    start: dayjs(`${a.date}T${a.startTime}`),
                    end: dayjs(`${a.date}T${a.endTime}`),
                }))
                .filter(({ end }) => end.isAfter(currentTime))
                .sort((a, b) => a.start.diff(b.start));

            let count = 1;
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i].start.diff(sorted[i - 1].end, "minutes") <= 10) {
                    count++;
                    if (count >= 3) return true;
                } else {
                    count = 1;
                }
            }
            return false;
        },
        action: ({ setCustomStatus }) => {
            setCustomStatus("Back-to-back sessions");
        },
        description:
            "Set 'Back-to-back sessions' if 3 or more appointments are close together.",
    },
    {
        id: "long-busy-stretch",
        trigger: "longBusy",
        condition: ({ currentTime, appointments, currentStatus }) => {
            if (currentStatus !== "Busy") return false;

            const threeHoursAgo = currentTime.subtract(3, "hour");
            return appointments.some((a) => {
                const start = dayjs(`${a.date}T${a.startTime}`);
                const end = dayjs(`${a.date}T${a.endTime}`);
                return (
                    start.isBefore(currentTime) && end.isAfter(threeHoursAgo)
                );
            });
        },
        action: ({ setCustomStatus }) => {
            setCustomStatus("Take a break soon");
        },
        description:
            "Set 'Take a break soon' if user has been in Busy mode for 3+ hours.",
    },
    {
        id: "end-of-day",
        trigger: "endOfDay",
        condition: ({ currentTime, appointments }) => {
            if (currentTime.hour() < 19) return false;
            return appointments.every((a) =>
                dayjs(`${a.date}T${a.endTime}`).isBefore(currentTime)
            );
        },
        action: ({ setStatus }) => {
            setStatus("Offline");
        },
        description:
            "Set status to 'Offline' after 7pm if no more appointments today.",
    },
    {
        id: "focus-morning",
        trigger: "timeOfDay",
        condition: ({ currentTime, appointments }) => {
            const hour = currentTime.hour();
            if (hour < 8 || hour >= 10) return false;
            return appointments.every((a) =>
                dayjs(`${a.date}T${a.startTime}`).isAfter(currentTime)
            );
        },
        action: ({ setCustomStatus }) => {
            setCustomStatus("Focus time");
        },
        description: "Set 'Focus time' between 8–10AM if no appointments.",
    },
    {
        id: "afternoon-admin",
        trigger: "timeOfDay",
        condition: ({ currentTime, appointments }) => {
            if (currentTime.hour() !== 15) return false;
            return appointments.every((a) => {
                const start = dayjs(`${a.date}T${a.startTime}`);
                return start.isAfter(currentTime.add(1, "hour"));
            });
        },
        action: ({ setCustomStatus }) => {
            setCustomStatus("Admin block");
        },
        description: "Set 'Admin block' at 3pm if there's a free hour ahead.",
    },
    {
        id: "early-start-focus",
        trigger: "timeOfDay",
        condition: ({ currentTime }) =>
            currentTime.hour() >= 6 && currentTime.hour() < 8,
        action: ({ setCustomStatus }) => {
            setCustomStatus("Early focus time");
        },
        description: "Set 'Early focus time' if user is active before 8AM.",
    },
    {
        id: "post-lunch-energize",
        trigger: "timeOfDay",
        condition: ({ currentTime }) => currentTime.hour() === 13,
        action: ({ setCustomStatus }) => {
            setCustomStatus("Quick reset");
        },
        description: "Suggest 'Quick reset' after lunch (1PM).",
    },
    {
        id: "long-gap-strategy",
        trigger: "noAppointments",
        condition: ({ currentTime, appointments }) => {
            const upcoming = appointments
                .map((a) => dayjs(`${a.date}T${a.startTime}`))
                .filter((d) => d.isAfter(currentTime))
                .sort((a, b) => a.diff(b));

            if (upcoming.length < 2) return false;
            return upcoming[1].diff(upcoming[0], "hour") >= 3;
        },
        action: ({ setCustomStatus }) => {
            setCustomStatus("Strategy session");
        },
        description:
            "Suggest 'Strategy session' if there's a 3+ hour gap between meetings.",
    },
    {
        id: "friday-wrap-up",
        trigger: "timeOfDay",
        condition: ({ currentTime }) =>
            currentTime.day() === 5 && currentTime.hour() >= 15,
        action: ({ setCustomStatus }) => {
            setCustomStatus("Weekly review");
        },
        description: "Suggest 'Weekly review' on Friday afternoons.",
    },
];
