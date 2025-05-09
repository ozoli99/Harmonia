export type AppointmentStatus =
    | "Upcoming"
    | "Completed"
    | "Cancelled"
    | "Pending";

export interface Appointment {
    id: number;
    providerId: number;
    clientId: number;
    serviceType: string;
    date: string;
    startTime: string;
    endTime: string;
    status?: AppointmentStatus;
    notes?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
}
