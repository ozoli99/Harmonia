import { useState, useEffect, useCallback } from "react";
import { fetchAppointments } from "../api/appointments";
import { useAuth } from "@clerk/clerk-react";
import { Appointment } from "../types/appointments";

export type UseAppointmentsReturn = {
    appointments: Appointment[];
    loading: boolean;
    error: string;
    updateAppointment: (
        id: number,
        status: Appointment["status"],
        notes?: string
    ) => void;
};

const useAppointments = (): UseAppointmentsReturn => {
    const { getToken } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const token = (await getToken()) ?? undefined;
            const data = await fetchAppointments(token);
            setAppointments(data || []);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    const updateAppointment = useCallback(
        (id: number, status: Appointment["status"], notes?: string) => {
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment.id === id
                        ? {
                              ...appointment,
                              status,
                              description: notes || appointment.notes,
                          }
                        : appointment
                )
            );
        },
        []
    );

    return { appointments, loading, error, updateAppointment };
};

export default useAppointments;
