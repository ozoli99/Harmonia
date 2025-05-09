import type { Appointment } from "@features/appointments/types/appointments";
import type { Message } from "@features/messages/types/messages";
import type { Feedback } from "./feedback";

export const TAG_OPTIONS = [
    "All",
    "VIP",
    "Frequent",
    "New",
    "Inactive",
] as const;

export type ClientTag = (typeof TAG_OPTIONS)[number];

export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    gender?: "male" | "female" | "other";
    age?: number;

    tag: ClientTag;
    notes?: string;
    appointmentHistory: Appointment[];
    remindersEnabled: boolean;

    preferences?: Record<string, any>;
    customFields?: Record<string, string | number | boolean>;

    messages: Message[];
    feedback: Feedback[];
    createdAt: string;
    updatedAt: string;
}
