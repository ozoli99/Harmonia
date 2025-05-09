import React, { useState } from "react";
import { motion } from "framer-motion";

import AppointmentCard from "@features/appointments/components/AppointmentCard";

import useFilteredAppointments from "@shared/hooks/useFilteredAppointments";
import useAppointments from "@features/appointments/hooks/useAppointments";
import {
    LoadingIndicator,
    ErrorMessage,
    Button,
    EmptyState,
    FilterChips,
    SectionHeader,
} from "kaida-ui";
import { Appointment } from "../types/appointments";

type ViewMode = "upcoming" | "history";
type AppointmentFilter = "All" | NonNullable<Appointment["status"]>;

const Appointments: React.FC = () => {
    const { appointments, loading, error, updateAppointment } =
        useAppointments();
    const [view, setView] = useState<ViewMode>("upcoming");
    const [filter, setFilter] = useState<AppointmentFilter>("All");

    const displayedAppointments = useFilteredAppointments(
        appointments,
        view,
        filter
    );

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div className="min-h-screen px-8 py-24 bg-gradient-to-b from-[#FDFCFB] to-[#F5F5F5] dark:from-[#0C1B33] dark:to-[#1A2A4A] transition-all">
            <SectionHeader>
                {view === "upcoming"
                    ? "Your Upcoming Appointments"
                    : "Appointment History"}
            </SectionHeader>
            <FilterChips<ViewMode>
                filter={view}
                onChange={setView}
                options={["upcoming", "history"]}
            />
            {view === "upcoming" && (
                <FilterChips
                    filter={filter}
                    onChange={setFilter}
                    options={["All", "Upcoming", "Completed", "Cancelled"]}
                />
            )}

            {displayedAppointments.length > 0 ? (
                <motion.div
                    className="max-w-4xl mx-auto space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}>
                    {displayedAppointments.map((appt) => (
                        <AppointmentCard
                            key={appt.id}
                            appointment={{
                                ...appt,
                                status: appt.status ?? "Upcoming",
                            }}
                            onUpdate={updateAppointment}
                        />
                    ))}
                </motion.div>
            ) : (
                <EmptyState
                    icon="📅"
                    title={
                        view === "upcoming"
                            ? "No upcoming appointments"
                            : "No appointment history found"
                    }
                    description="Schedule one to get started"
                    action={
                        view === "upcoming" && (
                            <Button className="bg-[#CFA15D] hover:bg-[#E1B877] text-white">
                                Book an Appointment
                            </Button>
                        )
                    }
                />
            )}
        </div>
    );
};

export default Appointments;
