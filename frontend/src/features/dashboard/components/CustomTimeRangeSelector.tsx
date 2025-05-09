import React from "react";
import { motion } from "framer-motion";
import { Button } from "kaida-ui";

interface Props {
    customStart: number | null;
    customEnd: number | null;
    setCustomStart: (val: number | null) => void;
    setCustomEnd: (val: number | null) => void;
    onApply: (start: number, end: number) => void;
    onCancel: () => void;
}

const CustomTimeRangeSelector: React.FC<Props> = ({
    customStart,
    customEnd,
    setCustomStart,
    setCustomEnd,
    onApply,
    onCancel,
}) => {
    const isValid =
        customStart != null && customEnd != null && customStart < customEnd;

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border theme-panel shadow-soft">
            <div className="flex flex-col text-sm w-full max-w-[140px]">
                <label htmlFor="startTime" className="theme-subtext mb-1">
                    From:
                </label>
                <input
                    id="startTime"
                    type="time"
                    className="px-3 py-2 rounded-md border border-border bg-white dark:bg-surfaceDark text-sm text-base focus:ring-2 focus:ring-accent transition"
                    value={
                        customStart != null
                            ? `${String(customStart).padStart(2, "0")}:00`
                            : ""
                    }
                    onChange={(e) =>
                        setCustomStart(parseInt(e.target.value.split(":")[0]))
                    }
                />
            </div>

            <div className="flex flex-col text-sm w-full max-w-[140px]">
                <label htmlFor="endTime" className="theme-subtext mb-1">
                    To:
                </label>
                <input
                    id="endTime"
                    type="time"
                    className="px-3 py-2 rounded-md border border-border bg-white dark:bg-surfaceDark text-sm text-base focus:ring-2 focus:ring-accent transition"
                    value={
                        customEnd != null
                            ? `${String(customEnd).padStart(2, "0")}:00`
                            : ""
                    }
                    onChange={(e) =>
                        setCustomEnd(parseInt(e.target.value.split(":")[0]))
                    }
                />
            </div>

            <div className="flex gap-2 mt-2 sm:mt-6">
                <Button
                    size="sm"
                    variant="default"
                    disabled={!isValid}
                    onClick={() =>
                        isValid && onApply(customStart!, customEnd!)
                    }>
                    Apply
                </Button>

                <Button size="sm" variant="destructive" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </motion.div>
    );
};

export default CustomTimeRangeSelector;
