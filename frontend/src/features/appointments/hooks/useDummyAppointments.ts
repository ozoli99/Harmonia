import { useState, useCallback } from "react";
import { Appointment, AppointmentStatus } from "../types/appointments";
import { dummyAppointments } from "../../dashboard/constants/dashboardMocks";

export default function useDummyAppointments() {
    const [appointments, setAppointments] =
        useState<Appointment[]>(dummyAppointments);

    const [error] = useState<string | null>(null);
    const [loading] = useState(false);

    const updateAppointment = useCallback(
        (id: number, status: AppointmentStatus, description?: string) =>
            setAppointments((previous) =>
                previous.map((a) =>
                    a.id === id
                        ? { ...a, status, notes: description ?? a.notes }
                        : a
                )
            ),
        []
    );
    return { appointments, loading, error, updateAppointment };
}
