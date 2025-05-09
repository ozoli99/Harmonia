import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import React from "react";

export const statusStyles = {
    Upcoming:
        "text-[#22c55e] bg-[#E6F4EA] dark:bg-[#134E35] dark:text-[#50D18D]",
    Completed:
        "text-[#EAB308] bg-[#FEF3C7] dark:bg-[#7C6C10] dark:text-[#FFD166]",
    Cancelled:
        "text-[#EF4444] bg-[#FEE2E2] dark:bg-[#7A1A1A] dark:text-[#FF8F8F]",
    Pending:
        "text-[#3B82F6] bg-[#DBEAFE] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
};

export const statusIcons: Record<
    "Upcoming" | "Completed" | "Cancelled" | "Pending",
    React.ElementType
> = {
    Upcoming: CheckCircleIcon,
    Completed: ClockIcon,
    Cancelled: XCircleIcon,
    Pending: ArrowPathIcon,
};
