import React from "react";

const UpcomingAppointmentsWidget: React.FC<{ appointments: any[] }> = ({
    appointments,
}) => {
    // For simplicity, take the first 2 appointments that are "confirmed" (or simply the first two)
    const upcoming = appointments
        .filter((appt) => appt.status === "confirmed")
        .slice(0, 2);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upcoming Appointments
            </h4>
            {upcoming.length > 0 ? (
                upcoming.map((appt) => (
                    <div
                        key={appt.id}
                        className="mb-2 p-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-100">
                            {appt.provider} with {appt.customer} @{" "}
                            {appt.formattedTime}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    No upcoming appointments.
                </p>
            )}
        </div>
    );
};

export default UpcomingAppointmentsWidget;
