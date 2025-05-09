import { useState, useEffect } from "react";

export const useAppointmentTimer = (appointmentDate: Date | null) => {
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

    useEffect(() => {
        if (!appointmentDate) return;

        const updateTimer = () => {
            const now = new Date();
            const timeDiff = appointmentDate.getTime() - now.getTime();
            if (timeDiff <= 0) {
                setTimeRemaining("Now");
            } else {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 60000);
        return () => clearInterval(timer);
    }, [appointmentDate]);

    return timeRemaining;
};