import React from 'react';

const Calendar: React.FC = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const appointments = [
        { day: "Mon", appointments: 2 },
        { day: "Wed", appointments: 3 },
        { day: "Fri", appointments: 1 },
    ];

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Weekly Calendar</h2>
            <div className="grid grid-cols-7 gap-4">
                {days.map(day => (
                    <div key={day} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{day}</span>
                        {appointments.find(app => app.day === day) && (
                            <span className="mt-2 text-blue-600 font-bold">
                                {appointments.find(app => app.day === day)?.appointments}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;