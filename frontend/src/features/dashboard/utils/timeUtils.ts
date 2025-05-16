import dayjs from "dayjs";
import type { Status } from "kaida-ui";

export const getGreeting = (): string => {
    const hour = dayjs().hour();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

export const getSmartSuggestions = (): string[] => {
    const hour = dayjs().hour();
    if (hour < 11) return ["Planning", "Available", "Focus time"];
    if (hour < 17) return ["In session", "Admin tasks", "Coffee break"];
    return ["Offline", "Done for today"];
};

export const isStatus = (value: string): value is Status =>
    ["Available", "Busy", "Offline"].includes(value);
