import dayjs from "dayjs";
import { Appointment } from "@features/appointments/types/appointments";

export type SuggestionAction = {
    label: string;
    onClick: () => void;
};

export type Suggestion = {
    text: string;
    actions: SuggestionAction[];
};

export function useGapSuggestions(
    gapStart: string,
    gapEnd: string,
    appointments: Appointment[]
): Suggestion[] {
    const start = dayjs().hour(Number(gapStart.split(":")[0]));
    const duration = dayjs(gapEnd, "HH:mm").diff(start, "minute");

    const suggestions: Suggestion[] = [];

    if (duration >= 120) {
        suggestions.push({
            text: `Looks like you have a ${duration}-minute window-great time for admin work`,
            actions: [
                {
                    label: "Block Admin Time",
                    onClick: () => console.log("Scheduling admin block..."),
                },
            ],
        });
    }

    const sessionsToday = appointments.filter((appointment) =>
        dayjs().isSame(dayjs(appointment.date), "day")
    ).length;
    if (sessionsToday >= 3) {
        suggestions.push({
            text: `You've had ${sessionsToday} sessions-consider a quick break`,
            actions: [
                {
                    label: "Take a 15-min Break",
                    onClick: () => console.log("Break time!"),
                },
            ],
        });
    }

    return suggestions;
}
