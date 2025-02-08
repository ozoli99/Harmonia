import React from 'react';
import AppointmentCard from '../components/AppointmentCard';

const dummyAppointments = [
    { id: 1, provider: "Masseur A", customer: "Client A", time: "2024-12-31 14:00" },
    { id: 2, provider: "Masseur B", customer: "Client B", time: "2024-12-31 15:30" },
];

const Appointments: React.FC = () => {
    return (
        <div className='p-8'>
            <h2 className='text-3xl font-bold mb-6'>Appointments</h2>
            <div className='space-y-4'>
                {dummyAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
            </div>
        </div>
    );
};

export default Appointments;