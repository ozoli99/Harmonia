import React from "react";
import {
    CalendarCheck,
    Bell,
    PlayCircle,
    UserPlus,
    Send,
    XIcon,
} from "lucide-react";
import { useSidebar } from "@shared/contexts/SidebarContext";
import ClientDetailsCard from "@features/clients/components/ClientDetailsCard";
import AppointmentDrawer from "@features/appointments/components/AppointmentDrawer";
import { Button, Card, CardHeader, CardBody, ActionItem } from "kaida-ui";

interface RightSidebarProps {
    appointmentsToday: number;
    unreadMessages: number;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
    appointmentsToday,
    unreadMessages,
}) => {
    const {
        selectedClient,
        setSelectedClient,
        selectedAppointment,
        setSelectedAppointment,
        toggleReminder,
    } = useSidebar();

    const handleMessage = () => {
        console.log("Message client:", selectedClient?.name);
    };

    const handleBook = () => {
        console.log("Book appointment for:", selectedClient?.name);
    };

    const handleToggleReminder = () => {
        if (selectedClient) toggleReminder(selectedClient);
    };

    if (selectedAppointment && selectedClient) {
        return (
            <AppointmentDrawer
                appointment={selectedAppointment}
                client={selectedClient}
            />
        );
    }

    if (selectedClient) {
        return (
            <div className="flex flex-col h-full w-full px-6 py-6 space-y-6 overflow-y-auto bg-surface text-body rounded-l-2xl transition-colors">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Client Details</h2>
                    <button
                        onClick={() => setSelectedClient(null)}
                        className="text-subtle hover:text-danger transition-all">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <ClientDetailsCard
                    client={selectedClient}
                    onMessage={handleMessage}
                    onBook={handleBook}
                    onToggleReminder={handleToggleReminder}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full px-4 py-6 space-y-6 overflow-y-auto bg-surface text-body rounded-l-2xl transition-colors">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold">Quick Overview</h2>
                <p className="text-sm text-subtle">
                    Today’s snapshot of your activity
                </p>
            </div>

            {/* Appointments */}
            <Card>
                <CardHeader
                    title="Appointments"
                    subtitle="Today"
                    icon={<CalendarCheck className="icon" />}
                />
                <CardBody className="text-sm text-subtle space-y-2">
                    <p>
                        You have{" "}
                        <span className="font-semibold text-brand">
                            {appointmentsToday}
                        </span>{" "}
                        session{appointmentsToday !== 1 && "s"} today
                    </p>
                    <Button size="sm" variant="secondary" className="w-full">
                        View Schedule
                    </Button>
                </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader title="Quick Actions" />
                <CardBody as="ul" spacing="space-y-2">
                    <ActionItem
                        label="Start new appointment"
                        icon={<PlayCircle className="w-4 h-4" />}
                    />
                    <ActionItem
                        label="Invite client"
                        icon={<UserPlus className="w-4 h-4" />}
                    />
                    <ActionItem
                        label="Send reminder"
                        icon={<Send className="w-4 h-4" />}
                    />
                </CardBody>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader
                    title="Notifications"
                    icon={<Bell className="w-5 h-5 text-warning" />}
                />
                <CardBody className="text-sm text-subtle space-y-2">
                    <p>
                        You have{" "}
                        <span className="font-semibold text-warning">
                            {unreadMessages}
                        </span>{" "}
                        unread message{unreadMessages !== 1 && "s"}
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-brand px-0">
                        View all
                    </Button>
                </CardBody>
            </Card>

            {/* Footer */}
            <div className="mt-auto text-xs text-subtle border-t border-primary/10 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>All systems operational</span>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
