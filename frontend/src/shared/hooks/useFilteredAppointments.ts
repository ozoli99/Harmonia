import { useMemo } from "react";
import { Appointment } from "@features/appointments/types/appointments";

export default function useFilteredAppointments(
    appointments: Appointment[],
    view: "upcoming" | "history",
    filter: "All" | Appointment["status"]
) {
    const now = useMemo(() => new Date(), []);

    return useMemo(() => {
        const isUpcoming = (appointment: Appointment) => {
            const start = appointment.date.includes("T")
                ? new Date(appointment.date)
                : new Date(`${appointment.date}T${appointment.startTime}`);
            return start >= now;
        };
        const base =
            view === "upcoming"
                ? appointments.filter(isUpcoming)
                : appointments.filter((a) => !isUpcoming(a));

        return filter === "All"
            ? base
            : base.filter((a) => a.status === filter);
    }, [appointments, view, filter, now]);
}
