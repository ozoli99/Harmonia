import { useMemo } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { AppointmentHelpers, TimeUtils } from "@shared/utils";

dayjs.extend(isBetween);

export type KpiRange = "Today" | "This Week" | "This Month";

export const useKpiRange = (kpiRange: KpiRange) => {
    const now = dayjs();

    const rangeStartMapping: Record<KpiRange, dayjs.Dayjs> = {
        Today: now.startOf("day"),
        "This Week": now.startOf("week"),
        "This Month": now.startOf("month"),
    };

    const startOfRange = useMemo(() => rangeStartMapping[kpiRange], [kpiRange]);

    const unitMapping: Record<KpiRange, dayjs.ManipulateType> = {
        Today: "day",
        "This Week": "week",
        "This Month": "month",
    };

    const previousStart = useMemo(
        () => startOfRange.subtract(1, unitMapping[kpiRange]),
        [startOfRange, kpiRange]
    );

    const previousEnd = useMemo(
        () => startOfRange.subtract(1, "minute"),
        [startOfRange]
    );

    return { startOfRange, previousStart, previousEnd };
};

export const useKpiStats = (
    appointments: any[],
    startOfRange: dayjs.Dayjs,
    previousStart: dayjs.Dayjs,
    previousEnd: dayjs.Dayjs
) => {
    const currentAppointments = useMemo(
        () =>
            appointments.filter((appt) =>
                TimeUtils.getAppointmentDateTime(appt).isAfter(startOfRange)
            ),
        [appointments, startOfRange]
    );

    const previousAppointments = useMemo(
        () =>
            appointments.filter((appt) =>
                TimeUtils.getAppointmentDateTime(appt).isBetween(
                    previousStart,
                    previousEnd,
                    null,
                    "[]"
                )
            ),
        [appointments, previousStart, previousEnd]
    );

    const kpiStats = useMemo(
        () => ({
            revenue: "€210.00",
            sessions: currentAppointments.filter(
                (a) => a.status === "Completed"
            ).length,
            cancelations: currentAppointments.filter(
                (a) => a.status === "Cancelled"
            ).length,
            nextGap: (() => {
                const gap = AppointmentHelpers.getGaps(
                    currentAppointments,
                    8,
                    20
                )[0];
                return gap
                    ? `${Math.floor((gap.end - gap.start) / 60)}h`
                    : "None";
            })(),
            utilization:
                AppointmentHelpers.calculateUtilization(currentAppointments),
        }),
        [currentAppointments]
    );

    const previousStats = useMemo(
        () => ({
            sessions: previousAppointments.filter(
                (a) => a.status === "Completed"
            ).length,
            cancelations: previousAppointments.filter(
                (a) => a.status === "Cancelled"
            ).length,
            utilization:
                AppointmentHelpers.calculateUtilization(previousAppointments),
        }),
        [previousAppointments]
    );

    const kpiTrends = useMemo(
        () => ({
            sessions: `${kpiStats.sessions - previousStats.sessions}`,
            cancelations: `${
                kpiStats.cancelations - previousStats.cancelations
            }`,
            utilization: `${kpiStats.utilization - previousStats.utilization}%`,
        }),
        [kpiStats, previousStats]
    );

    return { currentAppointments, previousAppointments, kpiStats, kpiTrends };
};
