import React, { useState } from "react";
import Modal from "./Modal";
import { motion } from "framer-motion";
import { PencilIcon, CheckIcon, XMarkIcon, PaperAirplaneIcon, BellSlashIcon, BellIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useClients } from "../hooks/useClients";

const ClientDetailsModal: React.FC = () => {
    const {
        selectedClient: client,
        setSelectedClient,
        toggleReminder,
        addStaffNote,
        sendMessage,
        submitFeedback,
    } = useClients();
    
    const [newStaffNote, setNewStaffNote] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    if (!client) return null;

    return (
        <Modal isOpen={true} onClose={() => setSelectedClient(null)}>
            <motion.div 
                className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{client.name}</h3>

                <p className="text-gray-600 dark:text-gray-300">
                    📧 <strong>Email:</strong> {client.email}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                    📅 <strong>Last Appointment:</strong> {client.lastAppointment}
                </p>

                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">💆 Preferences</h4>
                <p className="text-gray-600 dark:text-gray-300">
                    🏷️ Preferred Massage: {client.preferences?.massageType || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                    💪 Pressure Level: {client.preferences?.pressureLevel || "N/A"}
                </p>
                {client.preferences?.oilAllergies && (
                    <p className="text-red-500">
                        ⚠️ Oil Allergies: {client.preferences.oilAllergies.join(", ")}
                    </p>
                )}

                {client.healthNotes && (
                    <>
                        <h4 className="mt-4 text-lg font-semibold text-red-500">⚕️ Health Notes</h4>
                        <p className="text-gray-600 dark:text-gray-300">{client.healthNotes}</p>
                    </>
                )}

                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">📝 Internal Staff Notes</h4>
                <ul className="mt-2 space-y-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    {client.staffNotes.length > 0 ? (
                        client.staffNotes.map((note, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-200">{note}</li>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No internal notes yet.</p>
                    )}
                </ul>

                <div className="mt-4">
                    <input
                        type="text"
                        value={newStaffNote}
                        onChange={(e) => setNewStaffNote(e.target.value)}
                        placeholder="Add internal note..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                        onClick={() => addStaffNote(client.id)}
                        className="mt-2 w-full py-2 rounded-md bg-blue-500 text-white font-medium flex items-center justify-center gap-2"
                    >
                        <PencilIcon className="w-5 h-5" />Add Note
                    </button>
                </div>

                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">📅 Upcoming Appointments</h4>
                <ul className="mt-2 space-y-2">
                    {client.appointmentHistory.filter(appt => appt.status === "Upcoming").map((appt, index) => (
                        <li key={index} className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
                            {appt.date} - {appt.type}
                            <div className="flex gap-2">
                                <button className="text-green-500" title="Mark as Completed">
                                    <CheckIcon className="w-5 h-5" />
                                </button>
                                <button className="text-red-500" title="Cancel">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">📩 Messages</h4>
                <div className="mt-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md h-48 overflow-y-auto">
                    {client.messages.length > 0 ? (
                        client.messages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-md ${msg.sender === "Staff" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"} my-1`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs opacity-75">{msg.timestamp}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
                    )}
                </div>

                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                        onClick={() => sendMessage(client.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-1"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />Send
                    </button>
                </div>

                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">🌟 Feedback & Ratings</h4>
                <div className="mt-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    {client.feedback.length > 0 ? (
                        client.feedback.map((entry, index) => (
                            <div key={index} className="p-2 rounded-md bg-gray-300 dark:bg-gray-800 my-1">
                                <p className="text-sm">⭐ {entry.rating} - {entry.comment}</p>
                                <p className="text-xs opacity-75">{entry.date}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No feedback yet.</p>
                    )}
                </div>

                <div className="mt-4">
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={newFeedback.rating}
                        onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                        type="text"
                        value={newFeedback.comment}
                        onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                        placeholder="Write feedback..."
                        className="w-full px-4 py-2 mt-2 border rounded-md"
                    />
                    <button onClick={() => submitFeedback(client.id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
                        Submit Feedback
                    </button>
                </div>

                <button 
                    className="mt-6 w-full py-3 rounded-full bg-blue-500 text-white font-medium flex items-center justify-center gap-2"
                    onClick={() => toggleReminder(client.id)}
                >
                    {client.remindersEnabled ? (
                        <>
                            <BellSlashIcon className="w-5 h-5" />Disable Reminders
                        </>
                    ) : (
                        <>
                            <BellIcon className="w-5 h-5" />Enable Reminders
                        </>
                    )}
                </button>

                <button
                    onClick={() => setShowRecurringModal(true)}
                    className="mt-6 w-full py-3 rounded-full bg-blue-500 text-white font-medium flex items-center justify-center gap-2"
                >
                    <CalendarIcon className="w-5 h-5" />Manage Recurring Appointments
                </button>

                <button
                    onClick={() => setShowBookingModal(true)}
                    className="mt-6 w-full py-3 rounded-full bg-blue-500 text-white font-medium flex items-center justify-center gap-2"
                >
                    <CalendarIcon className="w-5 h-5" />Schedule New Appointment
                </button>
            </motion.div>
        </Modal>
    );
};

export default ClientDetailsModal;