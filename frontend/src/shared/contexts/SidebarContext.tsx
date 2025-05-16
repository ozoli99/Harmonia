import React, { createContext, useContext, useState } from "react";
import { Client } from "@features/clients/types/client";
import { Appointment } from "@features/appointments/types/appointments";

interface SidebarContextProps {
    selectedClient: Client | null;
    setSelectedClient: (client: Client | null) => void;
    selectedAppointment: Appointment | null;
    setSelectedAppointment: (appointment: Appointment | null) => void;
    toggleReminder: (client: Client) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);

    const toggleReminder = (client: Client) => {
        setSelectedClient((prev) =>
            prev && prev.id === client.id
                ? { ...prev, remindersEnabled: !prev.remindersEnabled }
                : prev
        );
    };

    return (
        <SidebarContext.Provider
            value={{
                selectedClient,
                setSelectedClient,
                selectedAppointment,
                setSelectedAppointment,
                toggleReminder,
            }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context)
        throw new Error("useSidebar must be used within SidebarProvider");
    return context;
};
