import React from "react";
import { useUser } from "@clerk/clerk-react";
import LogoutButton from "../components/LogoutButton";

const Profile: React.FC = () => {
    const { user, isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
    if (!isSignedIn || !user) return <div className="p-8 text-center">You are not logged in</div>;

    const profileImage = (user as any).profileImageUrl || user.imageUrl || "https://via.placeholder.com/150";
    const email = user.emailAddresses && user.emailAddresses.length > 0 
        ? user.emailAddresses[0].emailAddress 
        : "No email available";

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <img
                    src={profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full mx-auto border border-gray-300"
                />
                <h2 className="mt-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                </h2>
                <p className="mt-2 text-center text-gray-600 dark:text-gray-300">{email}</p>
                <div className="mt-4 flex justify-center">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};

export default Profile;