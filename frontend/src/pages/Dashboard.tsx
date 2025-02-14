import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { ResponsiveLine } from "@nivo/line";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import GlobalSearch from "../components/GlobalSearch";
import NotificationsPanel from "../components/NotificationsPanel";
import AppointmentCard from "../components/AppointmentCard";
import AdminAppointmentCard from "../components/AdminAppointmentCard";
import UpcomingAppointmentsWidget from "../components/UpcomingAppointmentsWidget";
import QuickActions from "../components/QuickActions";
import CalendarPreview from "../components/CalendarPreview";
import SortableItem from "../components/SortableItem";
import {
    CalendarIcon,
    UserIcon,
    ChartBarIcon,
    BellIcon,
    ChatBubbleLeftIcon,
    PencilIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import MessagesWidget from "../components/MessagesWidget";
import OffersWidget from "../components/OffersWidget";
import PastAppointmentsWidget from "../components/PastAppointmentsWidget";
import ProfileWidget from "../components/ProfileWidget";
import { Client } from "../types/client";
import { useAuth, useSession, useUser } from "@clerk/clerk-react";

type Stat = {
    id: string;
    title: string;
    value: string;
    icon: React.JSX.Element;
};

const getIconForStat = (id: string): React.JSX.Element => {
    switch (id) {
        case "appointments":
            return <CalendarIcon className="w-10 h-10 text-blue-500" />;
        case "revenue":
            return <ChartBarIcon className="w-10 h-10 text-green-500" />;
        case "clients":
            return <UserIcon className="w-10 h-10 text-purple-500" />;
        default:
            return <UserIcon className="w-10 h-10 text-gray-500" />;
    }
};

const Dashboard: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const { session } = useSession();
    const { signOut } = useAuth();

    const today = dayjs().format("dddd, MMMM D, YYYY");

    const userRole = (user?.publicMetadata?.role as string) || "client";

    const handleSearch = (query: string) => {
        console.log("Searching for:", query);
    };

    const [showNotifications, setShowNotifications] = useState(false);
    const [revenueFilter, setRevenueFilter] = useState<
        "weekly" | "monthly" | "yearly"
    >("monthly");

    const revenueData = {
        weekly: [
            { x: "Mon", y: 300 },
            { x: "Tue", y: 450 },
            { x: "Wed", y: 500 },
            { x: "Thu", y: 600 },
            { x: "Fri", y: 700 },
        ],
        monthly: [
            { x: "Week 1", y: 3200 },
            { x: "Week 2", y: 4000 },
            { x: "Week 3", y: 3800 },
            { x: "Week 4", y: 4200 },
        ],
        yearly: [
            { x: "Jan", y: 12000 },
            { x: "Feb", y: 15000 },
            { x: "Mar", y: 17000 },
            { x: "Apr", y: 16000 },
            { x: "May", y: 18000 },
        ],
    };

    const [stats, setStats] = useState<Stat[]>([
        {
            id: "appointments",
            icon: <CalendarIcon className="w-10 h-10 text-blue-500" />,
            title: "Upcoming Appointments",
            value: "5 upcoming",
        },
        {
            id: "revenue",
            icon: <ChartBarIcon className="w-10 h-10 text-green-500" />,
            title: "Revenue",
            value: "$3,200 this month",
        },
        {
            id: "clients",
            icon: <UserIcon className="w-10 h-10 text-purple-500" />,
            title: "Client Retention",
            value: "87% repeat clients",
        },
    ]);

    useEffect(() => {
        if (userRole === "admin") {
            setStats((prev) => [
                ...prev,
                {
                    id: "users",
                    icon: <UserIcon className="w-10 h-10 text-indigo-500" />,
                    title: "Total Users",
                    value: "150 registered",
                },
            ]);
        }
    }, [userRole]);

    const upcomingAppointments = [
        {
            id: 1,
            provider: "Masseur A",
            customer: "Client A",
            formattedTime: "18:00",
            status: "confirmed" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 2,
            provider: "Masseur B",
            customer: "Client A",
            formattedTime: "20:00",
            status: "confirmed" as "confirmed" | "pending" | "cancelled",
        },
    ];

    const pastAppointments = [
        {
            id: 3,
            provider: "Masseur C",
            customer: "Client A",
            formattedTime: "12:00",
            status: "confirmed" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 4,
            provider: "Masseur A",
            customer: "Client A",
            formattedTime: "10:00",
            status: "cancelled" as "confirmed" | "pending" | "cancelled",
        },
    ];

    const messages = [
        {
            id: 1,
            sender: "Masseur A",
            content: "Your appointment is confirmed.",
            timestamp: "2023-09-01 14:00",
        },
        {
            id: 2,
            sender: "Support",
            content: "Your payment was successful.",
            timestamp: "2023-09-02 09:00",
        },
        {
            id: 3,
            sender: "Masseur B",
            content: "Your appointment is cancelled.",
            timestamp: "2023-08-01 14:00",
        },
        {
            id: 4,
            sender: "Support",
            content: "Your payment was successful.",
            timestamp: "2023-08-02 09:00",
        },
    ];

    const profile: Client = {
        id: 1,
        name: user?.firstName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "No email",
        avatar: user?.imageUrl || "https://via.placeholder.com/50",
        lastAppointment: "2023-09-05",
        details: "Some details about the client.",
        tag: "VIP",
        notes: "",
        appointmentHistory: [],
        healthNotes: "",
        mobilityIssues: "",
        preferences: {
            massageType: "Swedish",
            pressureLevel: "Medium",
            oilAllergies: ["None"],
            roomTemperature: "22°C",
            musicPreference: "Jazz",
            sessionDuration: "60 minutes",
        },
        remindersEnabled: true,
        staffNotes: [],
        previousMasseurNotes: [],
        messages: [],
        feedback: [],
    };

    const offers = [
        {
            id: 1,
            title: "Loyalty Discount",
            description: "10% off your next appointment.",
        },
        {
            id: 2,
            title: "Seasonal Special",
            description: "Book now and get a free upgrade.",
        },
    ];

    const [appointments, setAppointments] = useState([
        {
            id: 1,
            provider: "Masseur A",
            customer: "Client A",
            formattedTime: "14:00",
            status: "confirmed" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 2,
            provider: "Masseur B",
            customer: "Client B",
            formattedTime: "15:30",
            status: "pending" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 3,
            provider: "Masseur C",
            customer: "Client C",
            formattedTime: "17:00",
            status: "cancelled" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 4,
            provider: "Masseur A",
            customer: "Client A",
            formattedTime: "14:00",
            status: "confirmed" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 5,
            provider: "Masseur B",
            customer: "Client B",
            formattedTime: "15:30",
            status: "pending" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 6,
            provider: "Masseur C",
            customer: "Client C",
            formattedTime: "17:00",
            status: "cancelled" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 7,
            provider: "Masseur A",
            customer: "Client A",
            formattedTime: "14:00",
            status: "confirmed" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 8,
            provider: "Masseur B",
            customer: "Client B",
            formattedTime: "15:30",
            status: "pending" as "confirmed" | "pending" | "cancelled",
        },
        {
            id: 9,
            provider: "Masseur C",
            customer: "Client C",
            formattedTime: "17:00",
            status: "cancelled" as "confirmed" | "pending" | "cancelled",
        },
    ]);

    useEffect(() => {
        const serializableStats = stats.map(({ id, title, value }) => ({
            id,
            title,
            value,
        }));
        localStorage.setItem(
            "dashboard_stats_order",
            JSON.stringify(serializableStats)
        );
    }, [stats]);

    useEffect(() => {
        const savedOrder = localStorage.getItem("dashboard_stats_order");
        if (savedOrder) {
            const parsedStats: Omit<Stat, "icon">[] = JSON.parse(savedOrder);
            setStats(
                parsedStats.map((stat) => ({
                    ...stat,
                    icon: getIconForStat(stat.id),
                }))
            );
        }
    }, []);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setStats((prev) => {
                const oldIndex = prev.findIndex(
                    (stat) => stat.id === active.id
                );
                const newIndex = prev.findIndex((stat) => stat.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleAppointmentUpdate = (
        id: number,
        status: "confirmed" | "pending" | "cancelled",
        notes?: string
    ) => {
        console.log("Update appointment", id, status, notes);
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
            <GlobalSearch onSearch={handleSearch} />

            <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {profile.name}! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{today}</p>
                </div>
                <motion.div
                    className="relative cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full shadow-lg font-medium flex items-center gap-2 transition-all"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowNotifications((prev) => !prev)}>
                    <BellIcon className="w-5 h-5" />
                    Notifications
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        3
                    </span>
                </motion.div>
            </header>

            {showNotifications && (
                <NotificationsPanel
                    onClose={() => setShowNotifications(false)}
                />
            )}

            {userRole !== "admin" && (
                <>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileWidget
                            client={profile}
                            onEdit={() => console.log("Edit profile")}
                        />
                        <MessagesWidget
                            messages={messages}
                            onViewAll={() => console.log("View all messages")}
                        />
                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <UpcomingAppointmentsWidget
                            appointments={upcomingAppointments}
                            onViewAll={() =>
                                console.log("View all upcoming appoitments")
                            }
                        />
                        <PastAppointmentsWidget
                            appointments={pastAppointments}
                            onViewDetails={(id) =>
                                console.log("View details for appointment", id)
                            }
                        />
                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CalendarPreview appointments={appointments} />
                    </section>
                </>
            )}

            <OffersWidget
                offers={offers}
                onViewAll={() => console.log("View all offers")}
            />

            {/* Role-Specific Content */}
            {userRole === "masseur" && (
                <section className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Schedule
                    </h3>
                    {appointments.map((appt) => (
                        <AppointmentCard
                            key={appt.id}
                            appointment={appt}
                            onUpdate={handleAppointmentUpdate}
                        />
                    ))}
                </section>
            )}

            {userRole === "admin" && (
                <section className="space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        System Analytics &amp; KPIs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Total Clients
                            </h4>
                            <p className="text-2xl font-bold text-blue-500">
                                120
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Total Masseurs
                            </h4>
                            <p className="text-2xl font-bold text-green-500">
                                15
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Appointments This Week
                            </h4>
                            <p className="text-2xl font-bold text-purple-500">
                                45
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Global Appointment Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {appointments.map((appt) => (
                            <AdminAppointmentCard
                                key={appt.id}
                                appointment={appt}
                                onUpdate={handleAppointmentUpdate}
                            />
                        ))}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        User &amp; Client Management
                    </h3>
                    <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6">
                        <motion.button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-600"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => console.log("Manage Users")}>
                            Manage Users
                        </motion.button>
                        <motion.button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-green-600"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => console.log("Manage Clients")}>
                            Manage Clients
                        </motion.button>
                        <motion.button
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-purple-600"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => console.log("Assign Appointments")}>
                            Assign Appointments
                        </motion.button>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Support &amp; System Health
                    </h3>
                    <div className="bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6">
                        <p className="text-gray-700 dark:text-gray-300">
                            All systems operational. No critical alerts.
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Support tickets: 0 unresolved.
                        </p>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Role Management &amp; Settings
                    </h3>
                    <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6">
                        <motion.button
                            className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-indigo-600"
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                                console.log("Configure Permissions")
                            }>
                            Configure Permissions
                        </motion.button>
                        <motion.button
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-yellow-600"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => console.log("Service Settings")}>
                            Service Settings
                        </motion.button>
                        <motion.button
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-gray-600"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => console.log("System Settings")}>
                            System Settings
                        </motion.button>
                    </div>
                </section>
            )}

            {/* Draggable Stats Section */}
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                    items={stats.map((stat) => stat.id)}
                    strategy={verticalListSortingStrategy}>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((item) => (
                            <SortableItem key={item.id} id={item.id}>
                                <motion.div
                                    className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut",
                                    }}>
                                    {item.icon}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {item.value}
                                        </p>
                                    </div>
                                </motion.div>
                            </SortableItem>
                        ))}
                    </section>
                </SortableContext>
            </DndContext>

            {/* Revenue Trend Section */}
            <motion.div
                className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Revenue Trend
                    </h3>
                    <select
                        className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded"
                        value={revenueFilter}
                        onChange={(e) =>
                            setRevenueFilter(
                                e.target.value as
                                    | "weekly"
                                    | "monthly"
                                    | "yearly"
                            )
                        }>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div className="h-40">
                    <ResponsiveLine
                        data={[
                            { id: "Revenue", data: revenueData[revenueFilter] },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", min: 0, max: 4000 }}
                        axisBottom={{ tickSize: 5, tickPadding: 5 }}
                        colors={["#6366F1"]}
                        lineWidth={3}
                        pointSize={6}
                        useMesh={true}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
