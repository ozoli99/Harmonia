import React from "react";
import {
    CalendarIcon,
    UserIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";
import type { FilterOption, SearchCategory } from "../types/globalSearch";

export const FILTER_OPTIONS: FilterOption[] = [
    "All",
    "Appointments",
    "Clients",
    "Transactions",
];

export const categoryIcons: Record<SearchCategory, React.ElementType> = {
    Appointments: CalendarIcon,
    Clients: UserIcon,
    Transactions: BanknotesIcon,
};

export const mockData: Record<SearchCategory, string[]> = {
    Appointments: [
        "Upcoming Appointments",
        "Past Appointments",
        "Canceled Appointments",
    ],
    Clients: ["John Doe", "Jane Smith", "Robert Brown"],
    Transactions: ["Invoice #1234", "Pending Payment #5678", "Refund #91011"],
};
