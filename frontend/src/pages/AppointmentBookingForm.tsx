import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface AppointmentBookingFormInputs {
    massageType: string;
    date: string; // YYYY-MM-DD format
    time: string; // HH:MM format
    notes?: string;
}

const AppointmentBookingForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<AppointmentBookingFormInputs>();
    const onSubmit: SubmitHandler<AppointmentBookingFormInputs> = (data) => {
        // TODO: Integrate with your appointment service API call
        console.log("Booking appointment:", data);
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Book an Appointment</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="massageType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Massage Type
                    </label>
                    <select
                        {...register("massageType", { required: "Massage type is required" })}
                        id="massageType"
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a service</option>
                        <option value="Swedish">Swedish Massage</option>
                        <option value="DeepTissue">Deep Tissue Massage</option>
                        <option value="Sports">Sports Massage</option>
                        <option value="Aromatherapy">Aromatherapy Massage</option>
                    </select>
                    {errors.massageType && (
                        <p className="text-red-500 text-sm mt-1">{errors.massageType.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date
                    </label>
                    <input
                        type="date"
                        {...register("date", { required: "Date is required" })}
                        id="date"
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Time
                    </label>
                    <input
                        type="time"
                        {...register("time", { required: "Time is required" })}
                        id="time"
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes (Optional)
                    </label>
                    <textarea
                        {...register("notes")}
                        id="notes"
                        rows={3}
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Book Appointment
                </button>
            </form>
        </div>
    );
};

export default AppointmentBookingForm;