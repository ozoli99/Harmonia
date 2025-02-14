import React from "react";
import dayjs from "dayjs";

const CalendarPreview: React.FC<{ appointments: any[] }> = ({
    appointments,
}) => {
    const now = dayjs();
    const startOfMonth = now.startOf("month");
    const daysInMonth = now.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) =>
        startOfMonth.add(i, "day")
    );

    const hasAppointment = (day: dayjs.Dayjs) =>
        appointments.some((appt) =>
            dayjs(appt.formattedTime, "HH:mm").isValid()
        );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Calendar Preview
            </h4>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className="w-8 h-8 flex items-center justify-center relative">
                        <span className="text-sm text-gray-800 dark:text-gray-100">
                            {day.format("D")}
                        </span>
                        {hasAppointment(day) && (
                            <span className="absolute bottom-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPreview;
