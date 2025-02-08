import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { ExtendedUser } from '../types/User';
import ProfileCard from '../components/ProfileCard';

const Profile: React.FC = () => {
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/profile").then((response) => {
            setUser(response.data);
            setLoading(false);
        }).catch((err) => {
            console.error("Error fetching profile:", err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-600">Loading...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-600">User not found</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <ProfileCard user={user} />
        </div>
    );
};

export default Profile;