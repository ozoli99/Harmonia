import React, { useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import TodayOverview from "../widgets/TodayOverview";
import MessagesWidget from "@features/messages/components/MessagesWidget";
import ClientHighlights from "@features/clients/components/ClientHighlights";
import RevenueTrendChart from "../widgets/RevenueTrendChart";
import CalendarPreview from "@features/appointments/components/CalendarPreview";
import DashboardHeader from "../widgets/DashboardHeader";
import KPIWidgetGroup from "../widgets/KPIWidgetGroup";

import { AppointmentHelpers } from "@shared/utils";
import { useDarkMode } from "@shared/contexts/DarkModeContext";
import useAppointments from "@features/appointments/hooks/useAppointments";
import {
    dummyAppointments,
    mockMessages,
    mockRevenueData,
} from "../constants/dashboardMocks";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon, UserPlusIcon } from "lucide-react";
import { Button, LoadingSkeleton } from "kaida-ui";
import { useKpiRange, useKpiStats } from "../hooks/useKpi";
import { useMockClient } from "@features/clients/hooks/useMockClient";
import { Client } from "@features/clients/types/client";

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const { appointments, loading, error } = useAppointments();
    const [isDarkMode] = useDarkMode();

    const [kpiRange, setKpiRange] = useState<
        "Today" | "This Week" | "This Month"
    >("Today");

    const [revenueFilter, setRevenueFilter] = useState<
        "weekly" | "monthly" | "yearly"
    >("monthly");

    const { startOfRange, previousStart, previousEnd } = useKpiRange(kpiRange);

    const filledAppointments = useMemo(
        () =>
            appointments && appointments.length > 0
                ? appointments
                : dummyAppointments,
        [appointments]
    );

    const gaps = useMemo(
        () => AppointmentHelpers.getGaps(filledAppointments, 8, 20),
        [filledAppointments]
    );

    const { currentAppointments, kpiStats, kpiTrends } = useKpiStats(
        filledAppointments,
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
                status="Available"
                onNewAppointment={() => console.log("Open create modal")}
                onOpenCalendar={() => console.log("Go to calendar view")}
                timelineAppointments={filledAppointments}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="theme-card p-6 shadow-soft">
                    <h3 className="text-lg font-semibold theme-heading mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Button
                            animated
                            variant="default"
                            size="lg"
                            className="w-full flex items-center gap-3 rounded-xl shadow-sm hover:shadow-md"
                            onClick={() => console.log("New Appointment")}
                            icon={<PlusCircleIcon className="w-5 h-5" />}
                            iconPosition="left">
                            New Appointment
                        </Button>

                        <Button
                            animated
                            variant="default"
                            size="lg"
                            className="w-full flex items-center gap-3 rounded-xl shadow-sm hover:shadow-md"
                            onClick={() => console.log("Add Client")}
                            icon={<UserPlusIcon className="w-5 h-5" />}
                            iconPosition="left">
                            Add Client
                        </Button>

                        <Button
                            animated
                            variant="default"
                            size="lg"
                            className="w-full flex items-center gap-3 rounded-xl shadow-sm hover:shadow-md"
                            onClick={() => console.log("Send Message")}
                            icon={<EnvelopeIcon className="w-5 h-5" />}
                            iconPosition="left">
                            Send Message
                        </Button>
                    </div>
                </div>

                <MessagesWidget
                    messages={mockMessages}
                    onViewAll={() => console.log("View all messages")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ClientHighlights
                    client={client}
                    onMessage={handleMessage}
                    onViewProfile={(c) =>
                        console.log("View profile of", c.name)
                    }
                    onAddNote={(c) => console.log("Add note to", c.name)}
                />
                <CalendarPreview appointments={filledAppointments} />
            </div>

            <RevenueTrendChart
                data={mockRevenueData}
                filter={revenueFilter}
                onFilterChange={setRevenueFilter}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default Dashboard;
