import React from "react";

interface Appointment {
    id: number;
    provider: string;
    customer: string;
    time: string;
}

interface AppointmentCardProps {
    appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow hover:shadow-xl transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {appointment.provider}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Customer: {appointment.customer}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Time: {appointment.time}</p>
        </div>
    );
};

export default AppointmentCard;