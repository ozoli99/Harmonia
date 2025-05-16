import dayjs from "dayjs";
import { Suggestion, SuggestionAction } from "./useGapSuggestions";

export interface NextAppointmentSuggestionParams {
    startTime: Date;
    clientName: string;
    onSendReminder: () => void;
    onPrepareRoom: () => void;
    onGreetClient: () => void;
}

export function useNextAppointmentSuggestions({
    startTime,
    clientName,
    onSendReminder,
    onPrepareRoom,
    onGreetClient,
}: NextAppointmentSuggestionParams): Suggestion[] {
    const now = dayjs();
    const start = dayjs(startTime);
    const minutesUntil = Math.round(start.diff(now, "minute"));

    const suggestions: Suggestion[] = [];

    if (minutesUntil >= 60) {
        suggestions.push({
            text: `Your session with ${clientName} is in ${minutesUntil} minutes—send a reminder?`,
            actions: [
                {
                    label: "Send Reminder",
                    onClick: onSendReminder,
                },
            ],
        });
    }

    if (minutesUntil < 60 && minutesUntil >= 15) {
        suggestions.push({
            text: `You have ${minutesUntil} minutes before ${clientName} arrives—time to prepare the room.`,
            actions: [
                {
                    label: "Prepare Room",
                    onClick: onPrepareRoom,
                },
            ],
        });
    }

    if (minutesUntil <= 15 && minutesUntil > 0) {
        suggestions.push({
            text: `${clientName} arrives in ${minutesUntil} minutes—get ready to greet them.`,
            actions: [
                {
                    label: "Greet Client",
                    onClick: onGreetClient,
                },
            ],
        });
    }

    return suggestions;
}
