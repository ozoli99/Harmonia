import React from "react";
import dayjs from "dayjs";
import {
    CheckCircle,
    Video,
    MessageSquare,
    ClipboardList,
    FileText,
    X as XIcon,
    CalendarCheck,
    Pin,
} from "lucide-react";
import { Avatar, Button, Badge, Card, CardHeader, CardBody } from "kaida-ui";
import { Appointment } from "@features/appointments/types/appointments";
import { Client } from "@features/clients/types/client";
import { useSidebar } from "@shared/contexts/SidebarContext";

interface AppointmentDrawerProps {
    appointment: Appointment;
    client: Client;
}

const AppointmentDrawer: React.FC<AppointmentDrawerProps> = ({
    appointment,
    client,
}) => {
    const { setSelectedAppointment } = useSidebar();

    const start = dayjs(`${appointment.date}T${appointment.startTime}`);
    const end = dayjs(`${appointment.date}T${appointment.endTime}`);
    const minutesUntil = Math.max(0, start.diff(dayjs(), "minute"));

    const pill =
        minutesUntil <= 0
            ? { text: "Now", class: "bg-danger text-white" }
            : minutesUntil <= 5
            ? { text: `${minutesUntil} min`, class: "bg-warning text-black" }
            : {
                  text: `${minutesUntil} min`,
                  class: "bg-success/20 text-success",
              };

    return (
        <aside className="flex h-full w-full flex-col overflow-y-auto space-y-6 bg-surface px-6 py-6 rounded-l-2xl">
            {/* Header */}
            <header className="flex items-start justify-between gap-4">
                <div className="flex gap-3 min-w-0">
                    <Avatar
                        avatarUrl={client.avatar}
                        name={client.name}
                        size={56}
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold truncate">
                                {client.name}
                            </h2>

                            <Badge
                                label={pill.text}
                                className={pill.class}
                                size="xs"
                            />

                            <Badge
                                label={appointment.serviceType ?? "Session"}
                                size="xs"
                                variant="outline"
                                icon={<ClipboardList className="w-3 h-3" />}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-0.5">
                            {start.format("MMM D")} · {start.format("HH:mm")}–
                            {end.format("HH:mm")}
                        </p>
                    </div>
                </div>

                <button
                    aria-label="Close"
                    onClick={() => setSelectedAppointment(null)}
                    className="text-subtle transition-colors hover:text-danger">
                    <XIcon className="w-5 h-5" />
                </button>
            </header>

            {/* Quick actions */}
            <Card className="bg-muted/40 hover:shadow-md transition-shadow">
                <CardHeader
                    title="Quick actions"
                    icon={<Video className="w-4 h-4" />}
                />
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                            size="sm"
                            icon={<Video className="w-4 h-4" />}
                            aria-label={
                                minutesUntil <= 0 ? "Join call" : "Prepare room"
                            }
                            className="w-full">
                            {minutesUntil <= 0 ? "Join Call" : "Prepare"}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            icon={<CheckCircle className="w-4 h-4" />}
                            className="w-full"
                            aria-label="Mark arrived">
                            Mark Arrived
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            icon={<MessageSquare className="w-4 h-4" />}
                            className="w-full"
                            aria-label="Message client">
                            Message
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Checklist */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader
                    title="Pre-session checklist"
                    icon={<ClipboardList className="w-4 h-4" />}
                />
                <CardBody as="ul" spacing="space-y-1">
                    {[
                        "Room prepared",
                        "Forms received",
                        "Payment verified",
                    ].map((item) => (
                        <li
                            key={item}
                            className="ml-4 list-disc text-sm text-text-muted">
                            {item}
                        </li>
                    ))}
                </CardBody>
            </Card>

            {/* Notes */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader
                    title="Session notes"
                    icon={<FileText className="w-4 h-4" />}
                    actions={
                        <div className="flex items-center gap-2">
                            <Badge
                                label="Private"
                                variant="outline"
                                size="xs"
                            />
                            {appointment.metadata?.isFlagged && (
                                <Badge
                                    label="Pinned"
                                    variant="outline"
                                    size="xs"
                                    icon={<Pin className="w-3 h-3" />}
                                />
                            )}
                        </div>
                    }
                />
                <CardBody>
                    <textarea
                        autoFocus={minutesUntil <= 0}
                        defaultValue={appointment.notes ?? ""}
                        placeholder="Add quick notes…"
                        className="w-full min-h-[100px] rounded-md border border-border bg-background-light dark:bg-background-dark p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </CardBody>
            </Card>

            {/* Recent sessions */}
            {client.appointmentHistory?.length > 0 && (
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader
                        title="Recent sessions"
                        icon={<CalendarCheck className="w-4 h-4" />}
                    />
                    <CardBody spacing="space-y-2">
                        {client.appointmentHistory
                            .slice(-3)
                            .map(({ id, date, serviceType }) => (
                                <div
                                    key={id}
                                    className="flex justify-between items-center text-xs text-text-muted hover:bg-muted/20 px-2 py-1 rounded transition">
                                    <span>
                                        {dayjs(date).format("DD MMM YYYY")}
                                    </span>
                                    <span className="truncate">
                                        {serviceType}
                                    </span>
                                </div>
                            ))}
                    </CardBody>
                </Card>
            )}

            {/* Footer */}
            <footer className="mt-auto flex justify-center">
                <Button size="sm" variant="ghost" className="text-brand">
                    Open full client profile →
                </Button>
            </footer>
        </aside>
    );
};

export default AppointmentDrawer;
