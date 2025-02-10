import React from 'react';

interface Appointment {
    id: number;
    provider: string;
    customer: string;
    time: string;
}

const dummyAppointments: Appointment[] = [
    { id: 1, provider: 'Masseur A', customer: 'Client A', time: '2024-12-31 14:00' },
    { id: 2, provider: 'Masseur A', customer: 'Client B', time: '2024-12-31 15:30' },
];

const Dashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>
      
            <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Appointments</h3>
                <div className="space-y-4">
                    {dummyAppointments.map(app => (
                        <div
                            key={app.id}
                            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition"
                        >
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{app.provider}</h4>
                            <p className="text-gray-600 dark:text-gray-300">Customer: {app.customer}</p>
                            <p className="text-gray-500 dark:text-gray-400">Time: {app.time}</p>
                        </div>
                    ))}
                </div>
            </section>
      
            <section>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Calendar Summary</h3>
                <div className="grid grid-cols-7 gap-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div
                            key={day}
                            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                        >
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{day}</span>
                            {day === 'Mon' && <span className="mt-2 text-blue-600 font-bold">2</span>}
                            {day === 'Wed' && <span className="mt-2 text-blue-600 font-bold">3</span>}
                            {day === 'Fri' && <span className="mt-2 text-blue-600 font-bold">1</span>}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;