import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Appointment } from "../types/appointments";
import { getCurrentTimeOffset } from "../utils";
import { TimelineBarSegment, TimelineBarSegmentProps } from "kaida-ui";
import {
    TimeUtils,
    AppointmentHelpers,
    AppointmentFormatters,
} from "@shared/utils";

const TimelineBar: React.FC<{
    appointments: Appointment[];
    gaps: { start: number; end: number }[];
    startHour: number;
    timelineMinutes: number;
    peakRange?: { start: number; end: number };
}> = ({ appointments, gaps, startHour, timelineMinutes, peakRange }) => {
    const mapStatus = (status: string): TimelineBarSegmentProps["status"] => {
        switch (status) {
            case "Upcoming":
            case "Pending":
                return "pending";
            case "Completed":
                return "success";
            case "Cancelled":
                return "danger";
            default:
                return "default";
        }
    };

    return (
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 overflow-visible z-10">
            {/* Peak hour highlight */}
            {peakRange && (
                <div
                    className="absolute top-0 h-full bg-danger/20 rounded"
                    style={{
                        left: `${
                            ((peakRange.start - startHour * 60) /
                                timelineMinutes) *
                            100
                        }%`,
                        width: `${
                            ((peakRange.end - peakRange.start) /
                                timelineMinutes) *
                            100
                        }%`,
                    }}
                />
            )}

            {appointments.map((appointment, index) => {
                const offset = TimeUtils.convertTimeToOffset(
                    appointment.startTime,
                    startHour
                );
                const duration =
                    AppointmentHelpers.getAppointmentDuration(appointment);
                const status = mapStatus(appointment.status ?? "Upcoming");
                const tooltip = `${
                    appointment.serviceType || "Appointment"
                } · ${
                    appointment.startTime
                } (${AppointmentFormatters.formatStatus(
                    appointment.status ?? "Upcoming"
                )})`;

                return (
                    <TimelineBarSegment
                        key={index}
                        startOffset={offset}
                        duration={duration}
                        totalTimelineMinutes={timelineMinutes}
                        index={index}
                        status={status}
                        tooltip={tooltip}
                    />
                );
            })}

            {/* Long gap highlights */}
            {gaps.map((gap, idx) => (
                <div
                    key={idx}
                    className="absolute top-0 h-full bg-muted/40 rounded"
                    style={{
                        left: `${
                            ((gap.start - startHour * 60) / timelineMinutes) *
                            100
                        }%`,
                        width: `${
                            ((gap.end - gap.start) / timelineMinutes) * 100
                        }%`,
                    }}
                />
            ))}

            <ReactTooltip id="appt-tooltip" />

            {/* Current time indicator */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-danger animate-pulse"
                style={{
                    left: `${
                        (getCurrentTimeOffset(startHour, timelineMinutes) /
                            timelineMinutes) *
                        100
                    }%`,
                }}
            />
        </div>
    );
};

export default TimelineBar;
