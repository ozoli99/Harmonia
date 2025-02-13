import { useState, useEffect, useCallback } from "react";
import { Client } from "../types/client";
import { dummyClients } from "../constants/clients";

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>(dummyClients);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedTag, setSelectedTag] = useState<"All" | "VIP" | "Frequent" | "New">("All");
    const [sortOption, setSortOption] = useState<"Name" | "Last Appointment" | "Frequency">("Last Appointment");
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
        setClients(prevClients =>
            prevClients.map(client =>
                client.id === clientId ? { ...client, remindersEnabled: !client.remindersEnabled } : client
            )
        );
    };

    const addStaffNote = (clientId: number) => {
        if (newStaffNote.trim() !== "") {
            setClients(prevClients =>
                prevClients.map(client =>
                    client.id === clientId ? { ...client, staffNotes: [...client.staffNotes, newStaffNote] } : client
                )
            );
            setNewStaffNote("");
        }
    };

    const sendMessage = (clientId: number) => {
        if (newMessage.trim() !== "") {
            const timestamp = new Date().toLocaleString();
            setClients(prevClients =>
                prevClients.map(client =>
                    client.id === clientId
                        ? { ...client, messages: [...client.messages, { sender: "Staff", content: newMessage, timestamp }] }
                        : client
                )
            );
            setNewMessage("");
        }
    };

    const submitFeedback = (clientId: number) => {
        if (newFeedback.comment.trim() !== "") {
            const newEntry = { ...newFeedback, date: new Date().toISOString().split("T")[0] };
            setClients(prevClients =>
                prevClients.map(client =>
                    client.id === clientId ? { ...client, feedback: [...client.feedback, newEntry] } : client
                )
            );
            setNewFeedback({ rating: 5, comment: "" });
        }
    };

    const filteredClients = clients.filter(client =>
        selectedTag === "All" || client.tag === selectedTag
    );

    const sortedClients = [...filteredClients].sort((a, b) => {
        if (sortOption === "Name") return a.name.localeCompare(b.name);
        if (sortOption === "Last Appointment") return new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime();
        if (sortOption === "Frequency") return b.appointmentHistory.length - a.appointmentHistory.length;
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