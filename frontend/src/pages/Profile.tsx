import React, { useState } from "react";
import { motion } from "framer-motion";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
    CameraIcon,
    ShieldCheckIcon,
    MoonIcon,
    BellIcon,
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import { Button } from "kaida-ui";

const Profile: React.FC = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [uploading, setUploading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
    if (!isSignedIn || !user)
        return <div className="p-8 text-center">You are not logged in</div>;

    const profileImage =
        (user as any)?.profileImageUrl ||
        user?.imageUrl ||
        "https://via.placeholder.com/150";
    const email =
        user?.emailAddresses?.[0]?.emailAddress || "No email available";

    const nextAppointment = {
        date: "Monday, March 4",
        time: "3:00 PM",
        type: "Deep Tissue Massage",
        location: "Room 5, Wellness Center",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFCFB] to-[#F5F5F5] dark:from-[#0C1B33] dark:to-[#1A2A4A] p-6">
            <motion.div
                className="bg-white/80 dark:bg-[#1A2A4A]/80 backdrop-blur-xl border border-[#CFA15D]/40 dark:border-[#89AFC8]/40 shadow-xl rounded-3xl p-8 max-w-lg w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}>
                {/* Profile Image & Info */}
                <div className="relative flex flex-col items-center text-center">
                    <motion.img
                        src={profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-[#CFA15D]/50 dark:border-[#89AFC8]/50 shadow-lg object-cover"
                        whileHover={{ scale: 1.05 }}
                    />
                    <label
                        htmlFor="profile-upload"
                        className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                        <CameraIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <input
                            type="file"
                            id="profile-upload"
                            className="hidden"
                        />
                    </label>
                    <h2 className="mt-4 text-2xl font-bold text-[#0C1B33] dark:text-white">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{email}</p>
                </div>

                {/* Next Appointment Card */}
                <motion.div className="p-5 mt-6 rounded-2xl bg-white/80 dark:bg-[#0C1B33]/80 shadow-md border border-[#CFA15D]/30 dark:border-[#89AFC8]/30">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-6 h-6 text-[#CFA15D]" />
                        <span className="text-[#0C1B33] dark:text-white font-semibold text-lg">
                            Next Appointment
                        </span>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <ClockIcon className="w-5 h-5 text-purple-500" />
                            <span>
                                {nextAppointment.date} at {nextAppointment.time}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <MapPinIcon className="w-5 h-5 text-red-500" />
                            <span>{nextAppointment.location}</span>
                        </div>
                        <span className="px-3 py-1 text-sm bg-[#CFA15D] text-white rounded-full">
                            {nextAppointment.type}
                        </span>
                    </div>
                </motion.div>

                {/* Settings */}
                <div className="mt-6 space-y-4">
                    {[
                        {
                            label: "Notifications",
                            icon: (
                                <BellIcon className="w-6 h-6 text-yellow-500" />
                            ),
                            state: notificationsEnabled,
                            setState: setNotificationsEnabled,
                        },
                        {
                            label: "Dark Mode",
                            icon: (
                                <MoonIcon className="w-6 h-6 text-blue-500" />
                            ),
                            state: darkMode,
                            setState: setDarkMode,
                        },
                        {
                            label: "Two-Factor Authentication",
                            icon: (
                                <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                            ),
                            state: twoFactorEnabled,
                            setState: setTwoFactorEnabled,
                        },
                    ].map(({ label, icon, state, setState }, index) => (
                        <motion.div
                            key={index}
                            className="p-4 rounded-xl bg-white/80 dark:bg-[#0C1B33]/80 flex items-center justify-between shadow-md border border-[#CFA15D]/30 dark:border-[#89AFC8]/30"
                            whileHover={{ scale: 1.02 }}>
                            <div className="flex items-center gap-2">
                                {icon}
                                <span className="text-[#0C1B33] dark:text-white font-medium">
                                    {label}
                                </span>
                            </div>
                            <button
                                onClick={() => setState(!state)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                                    state
                                        ? "bg-[#CFA15D] text-white shadow-md"
                                        : "bg-gray-400 text-gray-900 dark:text-gray-100"
                                }`}>
                                {state ? "Enabled" : "Disabled"}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Logout Button */}
                <div className="mt-8">
                    <Button
                        onClick={() => signOut()}
                        variant="gradient"
                        animated
                        fullWidth
                        className="py-3 px-6 font-semibold text-white bg-gradient-to-r from-[#E63946] to-[#F4A261] hover:from-[#D62839] hover:to-[#E76F51] border border-[#E63946]/30 dark:border-[#E63946]/50"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 4px 15px rgba(230, 57, 70, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}>
                        Log Out
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
