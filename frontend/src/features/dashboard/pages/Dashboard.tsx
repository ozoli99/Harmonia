import React, { useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import DashboardHeader from "../widgets/DashboardHeader";

import { AppointmentHelpers } from "@shared/utils";
import { useDarkMode } from "@shared/contexts/DarkModeContext";
import useDummyAppointments from "@features/appointments/hooks/useDummyAppointments";
import { LoadingSkeleton } from "kaida-ui";
import { useKpiRange, useKpiStats } from "../hooks/useKpi";
import { useMockClient } from "@features/clients/hooks/useMockClient";
import { Client } from "@features/clients/types/client";

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const { appointments, loading, error } = useDummyAppointments();
    const [isDarkMode] = useDarkMode();

    const [kpiRange, setKpiRange] = useState<
        "Today" | "This Week" | "This Month"
    >("Today");

    const [revenueFilter, setRevenueFilter] = useState<
        "weekly" | "monthly" | "yearly"
    >("monthly");

    const { startOfRange, previousStart, previousEnd } = useKpiRange(kpiRange);

    const gaps = useMemo(
        () => AppointmentHelpers.getGaps(appointments, 8, 20),
        [appointments]
    );

    const { currentAppointments, kpiStats, kpiTrends } = useKpiStats(
        appointments,
        startOfRange,
        previousStart,
        previousEnd
    );

    const client = useMockClient(user ?? null);

    const handleMessage = (client: Client) =>
        console.log("Message", client.name);

    if (loading) return <LoadingSkeleton />;

    if (error) {
        return (
            <div className="p-4 theme-panel border border-danger text-danger font-medium">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 min-h-screen bg-background-light dark:bg-background-dark transition-colors">
            <DashboardHeader
                onNewAppointment={() => console.log("Open create modal")}
                onOpenCalendar={() => console.log("Go to calendar view")}
                appointments={appointments}
            />
        </div>
    );
};

export default Dashboard;
