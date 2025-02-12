import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { ResponsiveLine } from "@nivo/line";
import AppointmentCard from "../components/AppointmentCard";
import GlobalSearch from "../components/GlobalSearch";
import { CalendarIcon, UserIcon, ChartBarIcon, BellIcon } from "@heroicons/react/24/outline";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem";

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
    const today = dayjs().format("dddd, MMMM D, YYYY");

    const [revenueFilter, setRevenueFilter] = useState<"weekly" | "monthly" | "yearly">("monthly");

    const revenueData = {
        weekly: [{ x: "Mon", y: 300 }, { x: "Tue", y: 450 }, { x: "Wed", y: 500 }, { x: "Thu", y: 600 }, { x: "Fri", y: 700 }],
        monthly: [{ x: "Week 1", y: 3200 }, { x: "Week 2", y: 4000 }, { x: "Week 3", y: 3800 }, { x: "Week 4", y: 4200 }],
        yearly: [{ x: "Jan", y: 12000 }, { x: "Feb", y: 15000 }, { x: "Mar", y: 17000 }, { x: "Apr", y: 16000 }, { x: "May", y: 18000 }]
    };

    const [stats, setStats] = useState([
        { id: "appointments", icon: <CalendarIcon className="w-10 h-10 text-blue-500" />, title: "Upcoming Appointments", value: "5 upcoming" },
        { id: "revenue", icon: <ChartBarIcon className="w-10 h-10 text-green-500" />, title: "Revenue", value: "$3,200 this month" },
        { id: "clients", icon: <UserIcon className="w-10 h-10 text-purple-500" />, title: "Client Retention", value: "87% repeat clients" },
    ]);

    const [appointments, setAppointments] = useState([
        { id: 1, provider: "Masseur A", customer: "Client A", formattedTime: "14:00", status: "confirmed" as "confirmed" | "pending" | "cancelled" },
        { id: 2, provider: "Masseur B", customer: "Client B", formattedTime: "15:30", status: "pending" as "confirmed" | "pending" | "cancelled" },
        { id: 3, provider: "Masseur C", customer: "Client C", formattedTime: "17:00", status: "cancelled" as "confirmed" | "pending" | "cancelled" },
    ]);

    useEffect(() => {
        const serializableStats = stats.map(({ id, title, value }) => ({ id, title, value }));
        localStorage.setItem("dashboard_stats_order", JSON.stringify(serializableStats));
    }, [stats]);

    useEffect(() => {
        const savedOrder = localStorage.getItem("dashboard_stats_order");
        if (savedOrder) {
            const parsedStats: Omit<Stat, "icon">[] = JSON.parse(savedOrder);
            setStats(parsedStats.map((stat) => ({
                ...stat,
                icon: getIconForStat(stat.id)
            })));
        }
    }, []);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setStats((prev) => {
                const oldIndex = prev.findIndex((stat) => stat.id === active.id);
                const newIndex = prev.findIndex((stat) => stat.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
            <GlobalSearch onSearch={(query) => console.log("Searching for:", query)} />

            <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome back, Alex! 👋</h2>
                    <p className="text-gray-600 dark:text-gray-400">{today}</p>
                </div>
                <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full shadow-lg font-medium flex items-center gap-2 transition-all"
                    whileHover={{ scale: 1.05 }}
                >
                    <BellIcon className="w-5 h-5" />
                    Free Trial: 7 days remaining
                </motion.div>
            </header>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={stats.map((stat) => stat.id)} strategy={verticalListSortingStrategy}>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((item) => (
                            <SortableItem key={item.id} id={item.id}>
                                <motion.div
                                    className="relative bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-lg p-6 flex items-center gap-4 transition-all hover:shadow-2xl hover:-translate-y-1"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    {item.icon}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
                                    </div>
                                </motion.div>
                            </SortableItem>
                        ))}
                    </section>
                </SortableContext>
            </DndContext>

            <section className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
                <select 
                    className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded mb-4"
                    value={revenueFilter}
                    onChange={(e) => setRevenueFilter(e.target.value as "weekly" | "monthly" | "yearly")}
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <div className="h-40">
                    <ResponsiveLine
                        data={[{ id: "Revenue", data: revenueData[revenueFilter] }]}
                        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", min: 0, max: 4000 }}
                        colors={["#6366F1"]}
                        lineWidth={3}
                        pointSize={6}
                    />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;