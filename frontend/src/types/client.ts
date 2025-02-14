export interface Appointment {
    id: number;
    provider: string;
    customer: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    status?: "Upcoming" | "Completed" | "Cancelled";
    description?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

export interface Feedback {
    rating: number;
    comment: string;
    date: string;
}

export interface Preferences {
    massageType: string;
    pressureLevel: "Soft" | "Medium" | "Strong";
    oilAllergies?: string[];
    roomTemperature?: string;
    musicPreference?: string;
    sessionDuration?: string;
}

export interface Client {
    id: number;
    name: string;
    email: string;
    lastAppointment: string;
    details: string;
    avatar?: string;
    tag: "VIP" | "Frequent" | "New";
    notes?: string;
    appointmentHistory: Appointment[];
    healthNotes?: string;
    mobilityIssues?: string;
    preferences?: Preferences;
    remindersEnabled: boolean;
    staffNotes: string[];
    previousMasseurNotes?: string[];
    messages: Message[];
    feedback: Feedback[];
}