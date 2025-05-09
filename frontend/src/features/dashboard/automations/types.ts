import { Appointment } from "@features/appointments/types/appointments";
import dayjs from "dayjs";
import { StatusType } from "../components/StatusAvatarDropdown";

export type TriggerType =
    | "timeOfDay"
    | "appointmentStart"
    | "noAppointments"
    | "backToBackAppointments"
    | "longBusy"
    | "endOfDay";

export interface RuleContext {
    currentTime: dayjs.Dayjs;
    appointments: Appointment[];
    currentStatus: StatusType;
    setStatus: (status: StatusType) => void;
    setCustomStatus: (status: string) => void;
    notify?: (message: string) => void;
}

export interface StatusTriggerRule {
    id: string;
    trigger: TriggerType;
    condition?: (context: RuleContext) => boolean;
    action: (context: RuleContext) => void;
    description?: string;
}
