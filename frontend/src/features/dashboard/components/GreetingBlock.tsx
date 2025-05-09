import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "kaida-ui";
import { cn } from "@shared/utils/ui/cn";
import { useTranslation } from "react-i18next";

interface Props {
    greeting?: string;
    today: string;
    customStatus: string | null;
    userName?: string;
}

const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅";
    if (hour < 18) return "☀️";
    return "🌙";
};

const getStatusStyle = (status: string) => {
    if (status.toLowerCase().includes("busy"))
        return "bg-red-100 text-red-600 dark:bg-red-800/20 dark:text-red-400";
    if (status.toLowerCase().includes("available"))
        return "bg-green-100 text-green-600 dark:bg-green-800/20 dark:text-green-400";
    if (status.toLowerCase().includes("lunch"))
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400";
    return "border-muted text-muted dark:border-mutedDark dark:text-mutedDark";
};

const GreetingBlock: React.FC<Props> = ({
    greeting,
    today,
    customStatus,
    userName,
}) => {
    const { t } = useTranslation();
    const emoji = getGreetingEmoji();

    const hour = new Date().getHours();
    const greetingKey =
        hour < 12
            ? "greeting.morning"
            : hour < 18
            ? "greeting.afternoon"
            : "greeting.evening";
    const displayGreeting = t(greetingKey);
    const displayName = userName ?? t("user.fallback");

    return (
        <div className="space-y-1 mb-3">
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl sm:text-3xl font-semibold sm:font-bold text-base dark:text-inverted"
                aria-label={`Greeting: ${displayGreeting}, ${displayName}`}>
                {`${displayGreeting}, ${displayName} ${emoji}`}
            </motion.h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-sm theme-subtext">
                <p>{today}</p>

                {customStatus && (
                    <motion.div
                        key={customStatus}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}>
                        <Badge
                            label={customStatus}
                            variant="outline"
                            className={cn(
                                "text-xs",
                                getStatusStyle(customStatus)
                            )}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GreetingBlock;
