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
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{appointment.provider}</h3>
            <p className="text-gray-700">Customer: {appointment.customer}</p>
            <p className="text-gray-500">Time: {appointment.time}</p>
        </div>
    );
};

export default AppointmentCard;