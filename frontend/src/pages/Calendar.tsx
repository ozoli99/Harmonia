import React, { useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "kaida-ui";

const appointmentTypes = {
    consultation:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900",
    massage: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900",
    followup:
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900",
};

interface Appointment {
    id: number;
    date: string;
    title: string;
    type: keyof typeof appointmentTypes;
}

const Calendar: React.FC = () => {
    const today = dayjs();
    const [selectedDate, setSelectedDate] = useState<string | null>(
        today.format("YYYY-MM-DD")
    );
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: 1,
            date: today.date(5).format("YYYY-MM-DD"),
            title: "Client A - 2 PM",
            type: "massage",
        },
        {
            id: 2,
            date: today.date(10).format("YYYY-MM-DD"),
            title: "Client B - 4 PM",
            type: "consultation",
        },
        {
            id: 3,
            date: today.date(15).format("YYYY-MM-DD"),
            title: "Client C - 3 PM",
            type: "followup",
        },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] =
        useState<Appointment | null>(null);

    const daysInMonth = today.daysInMonth();
    const firstDayOfMonth = today.startOf("month").day();
    const daysArray = Array.from(
        { length: firstDayOfMonth + daysInMonth },
        (_, index) =>
            index < firstDayOfMonth
                ? null
                : today.date(index - firstDayOfMonth + 1).format("YYYY-MM-DD")
    );

    const handleSaveAppointment = () => {
        if (!editingAppointment || !editingAppointment.title.trim()) return;
        setAppointments((prev) =>
            prev.some((app) => app.id === editingAppointment.id)
                ? prev.map((app) =>
                      app.id === editingAppointment.id
                          ? editingAppointment
                          : app
                  )
                : [...prev, { ...editingAppointment, id: Date.now() }]
        );
        setIsModalOpen(false);
        setEditingAppointment(null);
    };

    const handleDeleteAppointment = (id: number) => {
        setAppointments(appointments.filter((app) => app.id !== id));
    };

    // Drag & Drop Rescheduling
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setAppointments((prev) =>
            prev.map((app) =>
                app.id === Number(active.id) ? { ...app, date: over.id } : app
            )
        );
    };

    return (
        <div className="min-h-screen p-8 flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {today.format("MMMM YYYY")}
            </h2>

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                    items={daysArray.filter(Boolean) as string[]}
                    strategy={verticalListSortingStrategy}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-4xl">
                        <div className="grid grid-cols-7 gap-2 text-center text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <span key={day}>{day}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {daysArray.map((date, index) => (
                                <SortableItem key={index} id={date || ""}>
                                    <motion.div
                                        className={`relative aspect-square flex flex-col items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-300 transition-all
                                            ${
                                                date
                                                    ? "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800"
                                                    : "opacity-0 pointer-events-none"
                                            }
                                            ${
                                                selectedDate === date
                                                    ? "border-2 border-blue-500 dark:border-blue-400"
                                                    : ""
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedDate(date)}>
                                        {date && dayjs(date).date()}

                                        {appointments.some(
                                            (app) => app.date === date
                                        ) && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>
                                        )}
                                    </motion.div>
                                </SortableItem>
                            ))}
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

            {selectedDate && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 max-w-lg w-full">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dayjs(selectedDate).format("MMMM D, YYYY")}
                    </h3>
                    <div className="mt-3">
                        {appointments
                            .filter((app) => app.date === selectedDate)
                            .map((app) => (
                                <div
                                    key={app.id}
                                    className="p-3 flex justify-between items-center border-b">
                                    <div>
                                        <span className="text-gray-800 dark:text-gray-200">
                                            {app.title}
                                        </span>
                                        <span
                                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                                appointmentTypes[app.type]
                                            }`}>
                                            {app.type.charAt(0).toUpperCase() +
                                                app.type.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingAppointment(app);
                                                setIsModalOpen(true);
                                            }}>
                                            <PencilIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteAppointment(app.id)
                                            }>
                                            <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700 dark:hover:text-red-300" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        {!appointments.some(
                            (app) => app.date === selectedDate
                        ) && (
                            <p className="text-gray-500 dark:text-gray-400">
                                No appointments for this day.
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Calendar;
