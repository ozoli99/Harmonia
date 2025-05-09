import { Appointment } from "@features/appointments/types/appointments";
import { Client } from "../types/client";

export const getTotalVisits = (appointments: Appointment[]) =>
    appointments.length;

export const getMostFrequentService = (appointments: Appointment[]) => {
    const serviceCount: Record<string, number> = {};
    appointments.forEach(({ serviceType }) => {
        serviceCount[serviceType] = (serviceCount[serviceType] || 0) + 1;
    });
    return Object.keys(serviceCount).reduce(
        (a, b) => (serviceCount[a] > serviceCount[b] ? a : b),
        "N/A"
    );
};

export const getTrendStatus = (appointments: Appointment[]) => {
    if (appointments.length < 3) {
        return "stable";
    }

    const lastThree = appointments.slice(-3);
    const increasing = lastThree.every(
        (appt, idx, arr) =>
            idx === 0 || new Date(appt.date) > new Date(arr[idx - 1].date)
    );

    return increasing ? "increasing" : "declining";
};

export const getInitials = (name: string) =>
    name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export const hasClientAlerts = (client: Client): boolean => {
    const prefs = client.preferences;
    return (
        (Array.isArray(prefs?.oilAllergies) && prefs.oilAllergies.length > 0) ||
        Boolean(prefs?.musicPreference)
    );
};
