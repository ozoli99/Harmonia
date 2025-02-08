import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ProfileFormInputs {
    name: string;
    email: string;
}

const ProfileForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInputs>();
    const onSubmit: SubmitHandler<ProfileFormInputs> = data => {
        // TODO: Submit data to backend
        console.log("Profile Data:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    {...register("name", { required: "Name is required" })}
                    id="name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                    id="email"
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                Save Profile
            </button>
        </form>
    );
};

export default ProfileForm;