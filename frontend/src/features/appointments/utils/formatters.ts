import { Appointment } from "../types/appointments";

export const formatStatus = (status?: string): string =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

export const formatTime = (appointment: Appointment): string => {
    const date = new Date(appointment.date);
    const options: Intl.DateTimeFormatOptions = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}, ${appointment.startTime} - ${appointment.endTime}`;
};
