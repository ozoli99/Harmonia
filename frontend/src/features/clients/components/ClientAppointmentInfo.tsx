import React from "react";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Appointment } from "@features/appointments/types/appointments";

dayjs.extend(relativeTime);

interface Props {
    lastAppointment?: Appointment;
}

const ClientAppointmentInfo: React.FC<Props> = ({ lastAppointment }) => {
    if (!lastAppointment) {
        return <p className="text-sm text-gray-400">No appointments yet</p>;
    }

    const formatted = dayjs(new Date(lastAppointment.date)).format(
        "YYYY-MM-DD"
    );
    const relative = dayjs(new Date(lastAppointment.date)).fromNow();

    return (
        <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-3.5 h-3.5" />
            Last: {relative}
            <span className="text-[10px] text-gray-400 ml-1">{formatted}</span>
        </p>
    );
};

export default ClientAppointmentInfo;
