import React from 'react';
import { ExtendedUser } from '../types/User';

interface ProfileCardProps {
    user: ExtendedUser;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
                <img 
                    src={user.profilePicture || "https://via.placeholder.com/150"} 
                    alt={`${user.name}'s profile`}
                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                    <p className="text-gray-600 dark:text-gray-300">Role: {user.role}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Last Login: {new Date(user.lastLogin).toLocaleString()}
                    </p>
                    {user.verified && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                            Verified
                        </span>
                    )}
                </div>
            </div>
        
            {user.bio && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">About Me</h3>
                    <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                </div>
            )}
        
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.experience !== undefined && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Experience</h4>
                        <p className="text-gray-600 dark:text-gray-300">{user.experience} years</p>
                    </div>
                )}
                {user.location && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Location</h4>
                        <p className="text-gray-600 dark:text-gray-300">{user.location}</p>
                    </div>
                )}
                {user.specialties && user.specialties.length > 0 && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded col-span-1 sm:col-span-2">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Specialties</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                            {user.specialties.map((spec, idx) => (
                                <li key={idx}>{spec}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
  
export default ProfileCard;