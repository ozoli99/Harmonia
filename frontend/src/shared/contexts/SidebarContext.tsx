import React, { createContext, useContext, useState } from "react";
import { Client } from "@features/clients/types/client";

interface SidebarContextProps {
    selectedClient: Client | null;
    setSelectedClient: (client: Client | null) => void;
    toggleReminder: (client: Client) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const toggleReminder = (client: Client) => {
        setSelectedClient((prev) =>
            prev && prev.id === client.id
                ? { ...prev, remindersEnabled: !prev.remindersEnabled }
                : prev
        );
    };

    return (
        <SidebarContext.Provider
            value={{ selectedClient, setSelectedClient, toggleReminder }}>
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
