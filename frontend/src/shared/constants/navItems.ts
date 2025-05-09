// src/shared/constants/navItems.ts
import {
    LayoutDashboard,
    CalendarCheck,
    Users,
    MessageSquare,
    CreditCard,
    UserCog,
    BarChart,
    Megaphone,
    Sliders,
} from "lucide-react";
import { NavbarItemConfig } from "kaida-ui";

export const navItems: NavbarItemConfig[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Appointments", icon: CalendarCheck, href: "/appointments" },
    { label: "Clients", icon: Users, href: "/clients" },
    {
        label: "Communication",
        icon: MessageSquare,
        href: "/messages",
        notifications: 3,
    },
    { label: "Payments & Invoices", icon: CreditCard, href: "/payments" },
    { label: "Staff Management", icon: UserCog, href: "/staff" },
    { label: "Analytics & Reports", icon: BarChart, href: "/analytics" },
    { label: "Marketing Tools", icon: Megaphone, href: "/marketing" },
    { label: "Customisation", icon: Sliders, href: "/customisation" },
];
