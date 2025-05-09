import React from "react";
import dayjs from "dayjs";
import { Clock, Flame, Hourglass } from "lucide-react";

const AppointmentSummary = ({
    todayCount,
    workloadHours,
    workloadMinutes,
    peakHour,
    gap,
}: {
    todayCount: number;
    workloadHours: number;
    workloadMinutes: number;
    peakHour: string;
    gap?: { start: number; end: number };
}) => (
    <div className="flex-1">
        <h3 className="text-lg font-semibold theme-heading mb-1">
            Today's Appointments
        </h3>
        <div className="text-sm text-muted dark:text-gray-400 flex flex-col gap-1">
            <span>
                <Clock className="inline w-4 h-4 mr-1" /> Today: {workloadHours}
                h {workloadMinutes}m booked across {todayCount} session
                {todayCount !== 1 ? "s" : ""}
            </span>
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
            {peakHour !== "N/A" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-danger bg-danger/10 px-2 py-1 rounded-full">
                    <Flame className="w-4 h-4" /> Peak: {peakHour}
                </span>
            )}
            {gap && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    <Hourglass className="w-4 h-4" /> Gap:{" "}
                    {dayjs()
                        .startOf("day")
                        .add(gap.start, "minute")
                        .format("HH:mm")}{" "}
                    –{" "}
                    {dayjs()
                        .startOf("day")
                        .add(gap.end, "minute")
                        .format("HH:mm")}
                </span>
            )}
        </div>
    </div>
);

export default AppointmentSummary;
