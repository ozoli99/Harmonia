import React, { useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
    MessageSquare,
    CheckCircle,
    Clock4,
    MoreVertical,
    Phone,
    Video,
} from "lucide-react";
import { Button, Avatar } from "kaida-ui";
import { cn } from "@shared/utils/ui/cn";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { getPrimaryCTA } from "../utils/getPrimaryCTA";
import { Appointment } from "@features/appointments/types/appointments";
import { useSidebar } from "@shared/contexts/SidebarContext";
import { Client } from "@features/clients/types/client";

export type NextAppointmentWidgetProps = {
    // --- Core Data ---------------------------
    appointment: Appointment;
    client: Client;
    startTime: Date;
    appointmentMode?: "inPerson" | "teleHealth";
    reminderSent?: boolean;
    // --- Handlers ----------------------------
    onOpenDetails: () => void;
    onMessageClient?: () => void;
    onSendReminder?: () => void;
    onPrepareRoom?: () => void;
    onJoinCall?: () => void;
    onMarkArrived?: () => void;
    onCheckIn?: () => void;
    onCancel?: () => void;
    onReschedule?: () => void;
    // --- Visuals ----------------------------
    className?: string;
};

const getSessionLabel = (minutes: number) => {
    if (minutes <= 0) return "Now";
    if (minutes < 60) return `In ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `In ${hours}h`;
};

const getStatusClass = (minutes: number) => {
    if (minutes <= 0) return "bg-danger text-white";
    if (minutes <= 5) return "bg-warning text-black";
    return "bg-success/20 text-success";
};

const getLeftBorderClass = (minutes: number) => {
    if (minutes <= 0) return "border-l-danger";
    if (minutes <= 5) return "border-l-warning";
    return "border-l-success";
};

const NextAppointmentWidget: React.FC<NextAppointmentWidgetProps> = ({
    appointment,
    client,
    startTime,
    appointmentMode = "inPerson",
    reminderSent = false,
    onOpenDetails,
    onMessageClient,
    onSendReminder,
    onPrepareRoom,
    onJoinCall,
    onMarkArrived,
    onCheckIn,
    onCancel,
    onReschedule,
    className,
}) => {
    const { setSelectedClient, setSelectedAppointment } = useSidebar();

    const minutesUntil = useMemo(() => {
        const now = dayjs();
        const start = dayjs(startTime);
        return Math.round(start.diff(now, "minute"));
    }, [startTime]);

    const primary = getPrimaryCTA({
        minutesUntil,
        appointmentMode,
        reminderSent,
    });

    const handlePrimary = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        switch (primary) {
            case "Join Call":
                onJoinCall?.();
                break;
            case "Mark Arrived":
                onMarkArrived?.();
                break;
            case "Prepare Room":
                onPrepareRoom?.();
                break;
            case "Send Reminder":
                onSendReminder?.();
                break;
            default:
                onOpenDetails();
        }
    };

    const openSidebar = () => {
        setSelectedAppointment(appointment);
        setSelectedClient(client);
        onOpenDetails?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={cn(
                "p-3 rounded-xl shadow-sm border-l-4 cursor-pointer select-none",
                getLeftBorderClass(minutesUntil),
                minutesUntil <= 5 && "animate-soft-pulse",
                className
            )}
            onClick={openSidebar}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                        avatarUrl={client.avatar}
                        name={client.name}
                        size={42}
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate theme-heading">
                                {client.name}
                            </h3>
                            <span
                                className={cn(
                                    "text-xs px-2 py-[1px] rounded-full font-semibold min-w-[46px] text-center",
                                    getStatusClass(minutesUntil)
                                )}>
                                {getSessionLabel(minutesUntil)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-subtle mt-0.5">
                            <Clock4 className="w-3 h-3 shrink-0" />
                            {dayjs(startTime).format("HH:mm")}
                            {appointment.serviceType && (
                                <p className="text-xs text-text-muted dark:text-text-subtle truncate">
                                    {appointment.serviceType}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            icon={
                                primary === "Join Call" ? (
                                    <Video className="w-4 h-4" />
                                ) : primary === "Prepare Room" ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : primary === "Send Reminder" ? (
                                    <Phone className="w-4 h-4" />
                                ) : null
                            }
                            onClick={handlePrimary}>
                            {primary}
                        </Button>

                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        icon={
                                            <MessageSquare className="w-4 h-4" />
                                        }
                                        aria-label={`Message ${client.name}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMessageClient?.();
                                        }}
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Content
                                    side="top"
                                    className="theme-tooltip">
                                    Message {client.name}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>

                        <Dropdown.Root>
                            <Dropdown.Trigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={<MoreVertical className="w-4 h-4" />}
                                    aria-label="More actions"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Dropdown.Trigger>
                            <Dropdown.Content
                                align="end"
                                sideOffset={4}
                                className="w-44 py-1 rounded-md shadow-lg z-50 bg-white dark:bg-slate-800 border border-border/20 focus:outline-none">
                                <Dropdown.Item
                                    disabled={!onCheckIn}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition-colors cursor-pointer data-[highlighted]:bg-accent/10 data-[highlighted]:text-foreground data-[disabled]:opacity-40 data-[disabled]:pointer-events-none"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        onCheckIn?.();
                                    }}>
                                    Check‑in
                                </Dropdown.Item>
                                <Dropdown.Item
                                    disabled={!onReschedule}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition-colors cursor-pointer data-[highlighted]:bg-accent/10 data-[highlighted]:text-foreground data-[disabled]:opacity-40 data-[disabled]:pointer-events-none"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        onReschedule?.();
                                    }}>
                                    Reschedule
                                </Dropdown.Item>
                                <Dropdown.Item
                                    disabled={!onCancel}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition-colors cursor-pointer data-[highlighted]:bg-accent/10 data-[highlighted]:text-foreground data-[disabled]:opacity-40 data-[disabled]:pointer-events-none"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        onCancel?.();
                                    }}>
                                    Cancel Appointment
                                </Dropdown.Item>
                            </Dropdown.Content>
                        </Dropdown.Root>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NextAppointmentWidget;
