import {
    StarIcon,
    RepeatIcon,
    SparklesIcon,
    PauseIcon,
    BadgeInfoIcon,
    AlertTriangle,
} from "lucide-react";
import type { ClientTag } from "../types/client";
import type { AppointmentStatus } from "@features/appointments/types/appointments";
import { BadgeVariant } from "kaida-ui";

export const tagBadgeConfig: Record<
    ClientTag,
    { label: string; icon: React.ElementType; variant: BadgeVariant }
> = {
    VIP: { label: "VIP", icon: StarIcon, variant: "warning" },
    Frequent: { label: "Frequent", icon: RepeatIcon, variant: "success" },
    New: { label: "New", icon: SparklesIcon, variant: "info" },
    Inactive: { label: "Inactive", icon: PauseIcon, variant: "outline" },
    All: { label: "All", icon: BadgeInfoIcon, variant: "default" },
};

export const alertBadgeConfig: {
    label: string;
    icon: React.ElementType;
    variant: BadgeVariant;
} = {
    label: "Alert",
    icon: AlertTriangle,
    variant: "warning",
};

export const statusBadgeConfig: Record<
    AppointmentStatus,
    { label: string; icon: React.ElementType; colorClass: string }
> = {
    Upcoming: {
        label: "Upcoming",
        icon: BadgeInfoIcon,
        colorClass: "bg-blue-100 text-blue-800",
    },
    Completed: {
        label: "Completed",
        icon: BadgeInfoIcon,
        colorClass: "bg-green-100 text-green-800",
    },
    Cancelled: {
        label: "Cancelled",
        icon: BadgeInfoIcon,
        colorClass: "bg-red-100 text-red-800",
    },
    Pending: {
        label: "Pending",
        icon: BadgeInfoIcon,
        colorClass: "bg-blue-100 text-blue-800",
    },
};
