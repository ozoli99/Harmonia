import { useState, useEffect } from "react";
import { Client, ClientTag } from "../types/client";
import { dummyClients } from "../constants/clients";

const updateClientField = (
    clients: Client[],
    clientId: number,
    updater: (client: Client) => Client
): Client[] =>
    clients.map((client) =>
        client.id === clientId
            ? {
                  ...updater(client),
                  updatedAt: new Date().toISOString(),
              }
            : client
    );

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>(dummyClients);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedTag, setSelectedTag] = useState<ClientTag>("All");
    const [sortOption, setSortOption] = useState<
        "Name" | "Last Appointment" | "Frequency"
    >("Last Appointment");
    const [showFilters, setShowFilters] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const [newStaffNote, setNewStaffNote] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        const filtered = dummyClients.filter(
            (client) =>
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setClients(filtered);
    }, [searchTerm]);

    const toggleReminder = (clientId: number) => {
        setClients((prevClients) =>
            updateClientField(prevClients, clientId, (client) => ({
                ...client,
                remindersEnabled: !client.remindersEnabled,
            }))
        );
    };

    const addStaffNote = (clientId: number) => {
        if (newStaffNote.trim() === "") return;
        setClients((prevClients) =>
            updateClientField(prevClients, clientId, (client) => ({
                ...client,
                notes: client.notes
                    ? client.notes + "\n" + newStaffNote
                    : newStaffNote,
            }))
        );
        setNewStaffNote("");
    };

    const sendMessage = (clientId: number) => {
        if (newMessage.trim() === "") return;
        const timestamp = new Date().toISOString();
        setClients((prevClients) =>
            updateClientField(prevClients, clientId, (client) => ({
                ...client,
                messages: [
                    ...client.messages,
                    { sender: "Staff", content: newMessage, timestamp },
                ],
            }))
        );
        setNewMessage("");
    };

    const submitFeedback = (clientId: number) => {
        if (newFeedback.comment.trim() === "") return;
        const newEntry = {
            ...newFeedback,
            date: new Date().toISOString().split("T")[0],
        };
        setClients((prevClients) =>
            updateClientField(prevClients, clientId, (client) => ({
                ...client,
                feedback: [...client.feedback, newEntry],
            }))
        );
        setNewFeedback({ rating: 5, comment: "" });
    };

    const filteredClients = clients.filter(
        (client) => selectedTag === "All" || client.tag === selectedTag
    );

    const sortedClients = [...filteredClients].sort((a, b) => {
        if (sortOption === "Name") return a.name.localeCompare(b.name);
        if (sortOption === "Last Appointment")
            return (
                new Date(b.appointmentHistory.at(-1)?.date || 0).getTime() -
                new Date(a.appointmentHistory.at(-1)?.date || 0).getTime()
            );
        if (sortOption === "Frequency")
            return b.appointmentHistory.length - a.appointmentHistory.length;
        return 0;
    });

    return {
        clients,
        selectedClient,
        setSelectedClient,
        searchTerm,
        setSearchTerm,
        selectedTag,
        setSelectedTag,
        sortOption,
        setSortOption,
        showFilters,
        setShowFilters,
        showRecurringModal,
        setShowRecurringModal,
        showBookingModal,
        setShowBookingModal,
        toggleReminder,
        addStaffNote,
        sendMessage,
        submitFeedback,
        sortedClients,
        newStaffNote,
        setNewStaffNote,
        newMessage,
        setNewMessage,
        newFeedback,
        setNewFeedback,
    };
};
