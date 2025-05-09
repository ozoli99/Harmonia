import { Appointment } from "../types/appointments";
import { parseMinutes } from "./time";

export const getAppointmentDuration = (appointment: Appointment): number => {
    if (appointment.startTime && appointment.endTime) {
        return (
            parseMinutes(appointment.endTime) -
            parseMinutes(appointment.startTime)
        );
    }
    return 60;
};

export const getGaps = (
    appointments: Appointment[],
    startHour: number,
    endHour: number,
    minGapMinutes: number = 180
): { start: number; end: number }[] => {
    const sorted: Appointment[] = [...appointments].sort(
        (a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime)
    );

    const gaps: { start: number; end: number }[] = [];

    if (sorted.length === 0) {
        return [{ start: startHour * 60, end: endHour * 60 }];
    }

    const startOfDay = startHour * 60;
    const endOfDay = endHour * 60;

    if (parseMinutes(sorted[0].startTime) - startOfDay >= minGapMinutes) {
        gaps.push({
            start: startOfDay,
            end: parseMinutes(sorted[0].startTime),
        });
    }

    for (let i = 0; i < sorted.length - 1; i++) {
        const currentEnd =
            parseMinutes(sorted[i].endTime || sorted[i].startTime) +
            getAppointmentDuration(sorted[i]);
        const nextStart = parseMinutes(sorted[i + 1].startTime);
        if (nextStart - currentEnd >= minGapMinutes) {
            gaps.push({ start: currentEnd, end: nextStart });
        }
    }

    const last = sorted.at(-1);
    const lastEnd = parseMinutes(last?.endTime ?? last?.startTime ?? "00:00");
    if (endOfDay - lastEnd >= minGapMinutes) {
        gaps.push({ start: lastEnd, end: endOfDay });
    }

    return gaps;
};

export const getPeakHour = (appointments: Appointment[]) => {
    const hours = Array(12).fill(0);
    appointments.forEach((appointment) => {
        const index = Math.floor(
            (parseMinutes(appointment.startTime) - 480) / 60
        );
        if (index >= 0 && index < hours.length) {
            hours[index]++;
        }
    });

    const max = Math.max(...hours);
    const peakHourIndex = hours.findIndex((h) => h === max);
    if (peakHourIndex >= 0) {
        return {
            label: `${8 + peakHourIndex}:00 - ${9 + peakHourIndex}:00`,
            start: (8 + peakHourIndex) * 60,
            end: (9 + peakHourIndex) * 60,
        };
    }
    return null;
};

export const calculateTotalMinutes = (appointments: Appointment[]) =>
    appointments.reduce((sum, appt) => sum + getAppointmentDuration(appt), 0);

export const calculateUtilization = (appointments: Appointment[]) =>
    Math.min(
        100,
        Math.round((calculateTotalMinutes(appointments) / 720) * 100)
    );
