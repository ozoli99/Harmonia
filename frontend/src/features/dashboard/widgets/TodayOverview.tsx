import React, { useMemo } from "react";

import TimelineBar from "@features/appointments/components/TimelineBar";
import AppointmentSummary from "@features/appointments/components/AppointmentSummary";

import {
    getGaps,
    getPeakHour,
    getAppointmentDuration,
} from "@features/appointments/utils";
import { Appointment } from "@features/appointments/types/appointments";
import { Button, CircularProgress } from "kaida-ui";
import { PlusIcon, CalendarIcon } from "lucide-react";

interface TodayOverviewProps {
    appointments?: Appointment[];
    totalSlots?: number;
    onViewSchedule?: () => void;
    onAddAppointment?: () => void;
    startHour?: number;
    endHour?: number;
    minGapMinutes?: number;
}

const TodayOverview: React.FC<TodayOverviewProps> = ({
    appointments = [],
    totalSlots = 12,
    onViewSchedule,
    onAddAppointment,
    startHour = 8,
    endHour = 20,
    minGapMinutes = 180,
}) => {
    const {
        todayCount,
        totalMinutes,
        workloadHours,
        workloadMinutes,
        workloadPercent,
    } = useMemo(() => {
        const todayCount = appointments.length;
        const totalMinutes = appointments.reduce(
            (sum, appt) => sum + getAppointmentDuration(appt),
            0
        );
        return {
            todayCount,
            totalMinutes,
            workloadHours: Math.floor(totalMinutes / 60),
            workloadMinutes: totalMinutes % 60,
            workloadPercent: Math.min(
                100,
                Math.round((totalMinutes / 720) * 100)
            ),
        };
    }, [appointments]);

    const timelineMinutes = (endHour - startHour) * 60;

    const gaps = useMemo(
        () => getGaps(appointments, startHour, endHour, minGapMinutes),
        [appointments, startHour, endHour, minGapMinutes]
    );
    const peakHour = useMemo(() => getPeakHour(appointments), [appointments]);

    const isEmpty = todayCount === 0;
    const buttonLabel = isEmpty ? "Add Appointment" : "View Schedule";
    const buttonIcon = isEmpty ? (
        <PlusIcon className="w-4 h-4" />
    ) : (
        <CalendarIcon className="w-4 h-4" />
    );
    const handleButtonClick = isEmpty ? onAddAppointment : onViewSchedule;

    return (
        <div className="theme-panel p-6 relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between gap-6">
                <AppointmentSummary
                    todayCount={todayCount}
                    workloadHours={workloadHours}
                    workloadMinutes={workloadMinutes}
                    peakHour={peakHour?.label ?? "N/A"}
                    gap={gaps[0]}
                />
                <CircularProgress
                    percent={workloadPercent}
                    label="Utilization"
                    tooltip="Total booked time as a percentage of your workday"
                />
            </div>

            <div className="flex justify-end">
                <Button
                    animated
                    variant="default"
                    size="sm"
                    icon={buttonIcon}
                    iconPosition="left"
                    onClick={handleButtonClick}>
                    {buttonLabel}
                </Button>
            </div>

            {appointments.length > 0 ? (
                <div className="absolute left-0 right-0 bottom-0">
                    <TimelineBar
                        appointments={appointments}
                        gaps={gaps}
                        startHour={startHour}
                        timelineMinutes={timelineMinutes}
                        peakRange={
                            peakHour
                                ? { start: peakHour.start, end: peakHour.end }
                                : undefined
                        }
                    />
                </div>
            ) : (
                <div className="text-center text-sm theme-subtext mt-4">
                    No sessions scheduled yet. Add an appointment to fill your
                    day.
                </div>
            )}
        </div>
    );
};

export default TodayOverview;
