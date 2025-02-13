import { Appointment } from "../types/client";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

export const getTotalVisits = (history: Appointment[]) => history.length;

export const getMostFrequentService = (history: Appointment[]) => {
    const serviceCount: Record<string, number> = {};
    history.forEach(({ type }) => {
        serviceCount[type] = (serviceCount[type] || 0) + 1;
    });
    return Object.keys(serviceCount).reduce((a, b) => (serviceCount[a] > serviceCount[b] ? a : b), "N/A");
};

export const getTrendStatus = (history: Appointment[]) => {
    if (history.length > 2) {
        const lastThree = history.slice(-3);
        const increasing = lastThree.every((appt, idx, arr) => (idx === 0 ? true : new Date(appt.date) > new Date(arr[idx - 1].date)));
        
        return increasing ? "increasing" : "declining";
    }
    return "stable";
};