import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import LogoutButton from "../components/LogoutButton";
import { CameraIcon, ShieldCheckIcon, MoonIcon, BellIcon } from "@heroicons/react/24/outline";

const Profile: React.FC = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const [uploading, setUploading] = useState(false);

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
    if (!isSignedIn || !user) return <div className="p-8 text-center">You are not logged in</div>;

    const profileImage = (user as any).profileImageUrl || user.imageUrl || "https://via.placeholder.com/150";
    const email = user.emailAddresses?.[0]?.emailAddress || "No email available";
    const role = (user.publicMetadata as any)?.role || "User";
    const lastLogin = new Date(user.lastSignInAt || "").toLocaleString();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        // TODO: Replace with actual upload logic
        setTimeout(() => {
            console.log("Profile picture updated:", file);
            setUploading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl p-8 max-w-lg w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="relative flex flex-col items-center text-center">
                    <motion.img
                        src={profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 shadow-lg object-cover"
                        whileHover={{ scale: 1.05 }}
                    />
                    
                    <label htmlFor="profile-upload" className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer">
                        <CameraIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                        <input type="file" id="profile-upload" className="hidden" onChange={handleImageUpload} />
                    </label>

                    {uploading && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uploading...</p>}

                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{email}</p>
                </div>

                <div className="mt-6 space-y-4">
                    <motion.div
                        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Role</span>
                        <span className="text-gray-900 dark:text-white">{role}</span>
                    </motion.div>

                    <motion.div
                        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Last Login</span>
                        <span className="text-gray-900 dark:text-white">{lastLogin}</span>
                    </motion.div>

                    <motion.div
                        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Two-Factor Authentication</span>
                        </div>
                        <span className="text-gray-900 dark:text-white">Enabled</span>
                    </motion.div>

                    <motion.div
                        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center gap-2">
                            <MoonIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                        </div>
                        <span className="text-gray-900 dark:text-white">Auto</span>
                    </motion.div>

                    <motion.div
                        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-between shadow-md"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center gap-2">
                            <BellIcon className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Notifications</span>
                        </div>
                        <span className="text-gray-900 dark:text-white">Enabled</span>
                    </motion.div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <motion.button
                        className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                    >
                        Edit Profile
                    </motion.button>

                    <LogoutButton />
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;