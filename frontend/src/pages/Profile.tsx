import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import LogoutButton from "../components/LogoutButton";
import { CameraIcon, ShieldCheckIcon, MoonIcon, BellIcon, CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

const Profile: React.FC = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const [uploading, setUploading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
    if (!isSignedIn || !user) return <div className="p-8 text-center">You are not logged in</div>;

    const profileImage = (user as any)?.profileImageUrl || user?.imageUrl || "https://via.placeholder.com/150";
    const email = user?.emailAddresses?.[0]?.emailAddress || "No email available";

    const nextAppointment = {
        date: "Monday, March 4",
        time: "3:00 PM",
        type: "Deep Tissue Massage",
        location: "Room 5, Wellness Center",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <motion.div
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-8 max-w-lg w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="relative flex flex-col items-center text-center">
                    <motion.img
                        src={profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 shadow-lg object-cover"
                        whileHover={{ scale: 1.05 }}
                    />
                    <label htmlFor="profile-upload" className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                        <CameraIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <input type="file" id="profile-upload" className="hidden" />
                    </label>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{email}</p>
                </div>

                <motion.div className="p-5 mt-6 rounded-2xl bg-gray-100/80 dark:bg-gray-700/80 shadow-md border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-6 h-6 text-blue-500" />
                        <span className="text-gray-900 dark:text-white font-semibold text-lg">Next Appointment</span>
                    </div>
                    <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <ClockIcon className="w-5 h-5 text-purple-500" />
                            <span>{nextAppointment.date} at {nextAppointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <MapPinIcon className="w-5 h-5 text-red-500" />
                            <span>{nextAppointment.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                            <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full">{nextAppointment.type}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6 space-y-4">
                    <motion.div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2">
                            <BellIcon className="w-6 h-6 text-yellow-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Notifications</span>
                        </div>
                        <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`px-3 py-1 text-sm font-medium rounded-full ${notificationsEnabled ? "bg-green-500 text-white" : "bg-gray-400 text-gray-900 dark:text-gray-100"}`}>
                            {notificationsEnabled ? "On" : "Off"}
                        </button>
                    </motion.div>
                    <motion.div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2">
                            <MoonIcon className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                        </div>
                        <button onClick={() => setDarkMode(!darkMode)}
                            className={`px-3 py-1 text-sm font-medium rounded-full ${darkMode ? "bg-green-500 text-white" : "bg-gray-400 text-gray-900 dark:text-gray-100"}`}>
                            {darkMode ? "On" : "Off"}
                        </button>
                    </motion.div>
                    <motion.div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Two-Factor Authentication</span>
                        </div>
                        <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                            className={`px-3 py-1 text-sm font-medium rounded-full ${twoFactorEnabled ? "bg-green-500 text-white" : "bg-gray-400 text-gray-900 dark:text-gray-100"}`}>
                            {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </button>
                    </motion.div>
                </div>

                <div className="mt-8">
                    <LogoutButton />
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;