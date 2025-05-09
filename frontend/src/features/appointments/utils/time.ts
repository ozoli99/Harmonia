import dayjs from "dayjs";
import { Appointment } from "../types/appointments";

export const parseMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

export const convertTimeToOffset = (
    time: string,
    startHour: number
): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours - startHour) * 60 + minutes;
};

export const getCurrentTimeOffset = (
    startHour: number,
    timelineMinutes: number
): number => {
    const now = dayjs();
    const minutes = now.hour() * 60 + now.minute();
    return Math.max(0, Math.min(timelineMinutes, minutes - startHour * 60));
};

export const getAppointmentDateTime = (appt: Appointment): dayjs.Dayjs =>
    dayjs(`${appt.date} ${appt.startTime}`, "YYYY-MM-DD HH:mm");
