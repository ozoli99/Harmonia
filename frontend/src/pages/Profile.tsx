import React from 'react';
import ProfileForm from '../components/ProfileForm';

const Profile: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
            <ProfileForm />
        </div>
    );
};

export default Profile;