import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ProfileFormInputs {
    name: string;
    email: string;
    bio?: string;
}

const ProfileEditor: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInputs>();
    const onSubmit: SubmitHandler<ProfileFormInputs> = data => {
        // TODO: Submit profile data to backend
        console.log("Profile updated", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Edit Profile</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                    {...register("name", { required: "Name is required" })}
                    id="name"
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                    id="email"
                    type="email"
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                    {...register("bio")}
                    id="bio"
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Save Changes
            </button>
        </form>
    );
};

export default ProfileEditor;