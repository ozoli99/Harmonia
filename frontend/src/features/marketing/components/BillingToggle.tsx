import React from "react";
import { cn } from "@shared/utils/ui/cn";

type BillingCycle = "monthly" | "yearly";

interface BillingToggleProps {
    value: BillingCycle;
    onChange: (value: BillingCycle) => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center bg-surface-light dark:bg-base rounded-full p-1 shadow-sm border border-primary/20 dark:border-secondary/30">
            {["monthly", "yearly"].map((cycle) => (
                <button
                    key={cycle}
                    onClick={() => onChange(cycle as BillingCycle)}
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-medium transition-all",
                        value === cycle
                            ? "bg-primary text-white shadow-md"
                            : "text-text-muted dark:text-mutedDark"
                    )}>
                    {cycle === "monthly" ? "Monthly" : "Yearly"}
                    {cycle === "yearly" && (
                        <span className="ml-1 text-xs text-success">
                            (Save 2 months)
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default BillingToggle;
