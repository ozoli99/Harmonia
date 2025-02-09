import React from "react";
import { useUser } from "@clerk/clerk-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const UserManagement: React.FC = () => {
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div className="text-sm text-gray-500">Loading...</div>;
    }

    if (!isSignedIn || !user) {
        return <LoginButton />;
    }

    const profileImage = (user as any).profileImageUrl || user.imageUrl || "https://via.placeholder.com/40";

    const email = user.emailAddresses && user.emailAddresses.length > 0 
        ? user.emailAddresses[0].emailAddress 
        : "No email available";

    return (
        <div className="flex items-center space-x-4">
            <img
                src={profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full border"
            />
            <span className="text-gray-800 dark:text-gray-200 font-semibold">
                {user.firstName} {user.lastName}
            </span>
            <LogoutButton />
        </div>
    );
};

export default UserManagement;