import React from "react";
import { motion } from "framer-motion";
import { UserCircleIcon, PencilIcon } from "lucide-react";
import { Client } from "../types/client";

interface ProfileWidgetProps {
    client: Client;
    onEdit: () => void;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = ({ client, onEdit }) => {
    const { name, email, avatar, preferences } = client;

    const renderPreferences = () => {
        if (!preferences) {
            return (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No preferences set.
                </p>
            );
        }
        return (
            <div className="space-y-2 mt-3">
                <div className="flex items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-400 mr-1">
                        Massage Type:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-200">
                        {preferences.massageType}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-400 mr-1">
                        Pressure Level:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-200">
                        {preferences.pressureLevel}
                    </span>
                </div>
                {preferences.oilAllergies &&
                    preferences.oilAllergies.length > 0 && (
                        <div className="flex items-center">
                            <span className="font-medium text-gray-700 dark:text-gray-400 mr-1">
                                Oil Allergies:
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-200">
                                {preferences.oilAllergies.join(", ")}
                            </span>
                        </div>
                    )}
                {preferences.roomTemperature && (
                    <div className="flex items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-400 mr-1">
                            Room Temperature:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-200">
                            {preferences.roomTemperature}
                        </span>
                    </div>
                )}
                {preferences.musicPreference && (
                    <div className="flex items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-400 mr-1">
                            Music Preference:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-200">
                            {preferences.musicPreference}
                        </span>
                    </div>
                )}
                {preferences.sessionDuration && (
                    <div className="flex items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-400 mr-1">
                            Session Duration:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-200">
                            {preferences.sessionDuration}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <UserCircleIcon className="w-14 h-14 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {email}
                        </p>
                    </div>
                </div>
                <motion.button
                    className="mt-4 sm:mt-0 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    whileTap={{ scale: 0.95 }}
                    onClick={onEdit}
                    title="Edit Profile">
                    <PencilIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Edit</span>
                </motion.button>
            </div>
            {/* Preferences Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                    Service Preferences
                </h4>
                {renderPreferences()}
            </div>
        </motion.div>
    );
};

export default ProfileWidget;
