import React from "react";
import { TrendingDown, TrendingUp, ChevronRight } from "lucide-react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { cn } from "@shared/utils/ui/cn";
import CountUp from "react-countup";

type Variant = "default" | "success" | "warning" | "error" | "highlight";
type IconPosition = "left" | "top";

type KPIWidgetProps = {
    title: string;
    value?: React.ReactNode;
    icon?: React.ReactNode;
    trend?: string;
    trendLabel?: string;
    sparkline?: number[];
    loading?: boolean;
    variant?: Variant;
    iconPosition?: IconPosition;
    tooltip?: string;
    onClick?: () => void;
    goal?: number;
    goalLabel?: string;
    valuePrefix?: string;
    valueSuffix?: string;
};

const getPaddedRange = (data: number[], padding = 2) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return {
        min: Math.floor(min - padding),
        max: Math.ceil(max + padding),
    };
};

const getAccessibleLabel = (value: React.ReactNode): string => {
    if (typeof value === "string" || typeof value === "number")
        return String(value);
    return "KPI data";
};

const KPIWidget: React.FC<KPIWidgetProps> = ({
    title,
    value,
    icon,
    trend,
    trendLabel,
    sparkline,
    variant = "default",
    iconPosition = "left",
    tooltip,
    loading = false,
    onClick,
    goal,
    goalLabel,
    valuePrefix,
    valueSuffix,
}) => {
    const isPositiveTrend = trend && !trend.startsWith("-");
    const isClickable = typeof onClick === "function";
    const numericValue = typeof value === "number" ? value : undefined;
    const progressPercent =
        goal && numericValue !== undefined
            ? Math.min(100, Math.round((numericValue / goal) * 100))
            : undefined;

    return (
        <div
            className={cn(
                "theme-panel p-4 rounded-xl shadow-sm transition group flex flex-col justify-between gap-2",
                isClickable &&
                    "cursor-pointer hover:ring-1 hover:ring-primary/20"
            )}
            onClick={onClick}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={`${title}: ${getAccessibleLabel(value)}`}
            title={tooltip}>
            <div
                className={cn(
                    "flex justify-between w-full",
                    iconPosition === "top" && "flex-col items-start"
                )}>
                <div
                    className={cn(
                        "flex items-center gap-3",
                        iconPosition === "top" && "flex-col items-start"
                    )}>
                    {icon && (
                        <div
                            className={cn(
                                "p-2 rounded-md bg-muted/10",
                                {
                                    default: "text-primary",
                                    success: "text-success",
                                    warning: "text-warning",
                                    error: "text-danger",
                                    highlight: "text-amber-600",
                                }[variant]
                            )}>
                            <span className="text-xl">{icon}</span>
                        </div>
                    )}
                    <div>
                        <h4 className="text-xs font-medium theme-subtext">
                            {title}
                        </h4>
                        {loading ? (
                            <div className="w-16 h-5 bg-muted animate-pulse rounded mt-1" />
                        ) : (
                            <p className="text-2xl font-bold leading-snug">
                                {typeof value === "number" ? (
                                    <CountUp
                                        end={value}
                                        prefix={valuePrefix}
                                        suffix={valueSuffix}
                                        duration={1}
                                    />
                                ) : (
                                    value ?? "-"
                                )}
                            </p>
                        )}
                    </div>
                </div>
                {isClickable && (
                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            {trend && (
                <div
                    className={cn(
                        "flex items-center gap-1 text-xs font-medium mt-1",
                        isPositiveTrend ? "text-success" : "text-danger"
                    )}>
                    {isPositiveTrend ? (
                        <TrendingUp className="w-3 h-3" />
                    ) : (
                        <TrendingDown className="w-3 h-3" />
                    )}
                    {trend}
                    {trendLabel && (
                        <span className="theme-subtext ml-1 opacity-70">
                            ({trendLabel})
                        </span>
                    )}
                </div>
            )}

            {typeof goal === "number" && typeof numericValue === "number" && (
                <div className="mt-2 w-full">
                    <div className="flex justify-between text-xs theme-subtext mb-1">
                        <span>{goalLabel ?? `${numericValue} / ${goal}`}</span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {sparkline && sparkline.length > 1 && (
                <div className="pt-2 mt-2 border-t border-muted/10 w-full">
                    <Sparklines
                        data={sparkline}
                        limit={10}
                        {...getPaddedRange(sparkline)}
                        style={{ width: "100%", height: "40px" }}>
                        <SparklinesLine
                            color="#3b82f6"
                            style={{ strokeWidth: 1.5, fill: "none" }}
                            curve="basis"
                        />
                    </Sparklines>
                </div>
            )}
        </div>
    );
};

export default KPIWidget;
