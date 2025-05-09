import { useMemo } from "react";
import { Client } from "../types/client";
import { UserResource } from "@clerk/types";

export const useMockClient = (user: UserResource | null): Client =>
    useMemo(
        () => ({
            id: 1,
            name: user?.firstName || "User",
            email: user?.primaryEmailAddress?.emailAddress || "No email",
            avatar: user?.imageUrl || "https://via.placeholder.com/50",
            tag: "VIP",
            notes: "",
            appointmentHistory: [],
            remindersEnabled: true,
            staffNotes: [],
            messages: [],
            feedback: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }),
        [user]
    );
