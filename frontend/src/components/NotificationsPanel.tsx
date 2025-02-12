import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, BellIcon, CheckCircleIcon, ExclamationCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface Notification {
    id: number;
    message: string;
    type: "booking" | "cancellation" | "reminder";
    read?: boolean;
}

interface NotificationsPanelProps {
    onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
    const [notifications, setNotifications] = React.useState<Notification[]>([
        { id: 1, message: "New appointment booked for 3 PM.", type: "booking" },
        { id: 2, message: "Appointment canceled by Client B.", type: "cancellation" },
        { id: 3, message: "Reminder: Client C's session at 5 PM.", type: "reminder" },
    ]);

    const [autoClose, setAutoClose] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, 10000);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const notificationIcons = {
        booking: <CalendarIcon className="w-5 h-5 text-blue-500" />,
        cancellation: <XMarkIcon className="w-5 h-5 text-red-500" />,
        reminder: <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />,
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700 transition-all"
            >
                <div className="flex justify-between items-center p-4 bg-gray-200/50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoClose}
                                onChange={() => setAutoClose(!autoClose)}
                                className="mr-1"
                            />
                            Auto-close
                        </label>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-gray-300/50 dark:divide-gray-700">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-gray-600 dark:text-gray-400 text-sm text-center">
                            No new notifications.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className={`flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                                    notification.read ? "opacity-60" : "opacity-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {notificationIcons[notification.type]}
                                    <span className="text-gray-900 dark:text-gray-300">
                                        {notification.message}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-green-500 hover:text-green-600 transition"
                                            title="Mark as read"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeNotification(notification.id)}
                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                                        title="Dismiss"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NotificationsPanel;