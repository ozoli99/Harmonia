export type PrimaryCta =
    | "Join Call"
    | "Mark Arrived"
    | "Prepare Room"
    | "Send Reminder"
    | "View Details";

interface Args {
    minutesUntil: number;
    appointmentMode: "inPerson" | "teleHealth";
    reminderSent: boolean;
}

export const getPrimaryCTA = ({
    minutesUntil,
    appointmentMode,
    reminderSent,
}: Args): PrimaryCta => {
    if (minutesUntil <= 0) {
        return appointmentMode === "teleHealth" ? "Join Call" : "Mark Arrived";
    }

    if (minutesUntil <= 15) {
        return "Prepare Room";
    }

    if (minutesUntil <= 60 && !reminderSent) {
        return "Send Reminder";
    }

    return "View Details";
};
