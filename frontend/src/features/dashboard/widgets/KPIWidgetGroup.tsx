import React from "react";
import { CalendarCheck, Euro, PieChart, XCircle, BarChart } from "lucide-react";
import KPIWidget from "./KPIWidget";
import { cn } from "@shared/utils/ui/cn";

type KPIWidgetGroupProps = {
    stats: {
        revenue: string;
        sessions: number;
        cancelations: number;
        nextGap?: string;
        utilization: number;
    };
    trends?: {
        revenue?: string;
        sessions?: string;
        cancelations?: string;
        utilization?: string;
    };
    trendLabels?: {
        revenue?: string;
        sessions?: string;
        cancelations?: string;
        utilization?: string;
    };
    sparklines?: {
        revenue?: number[];
        sessions?: number[];
        cancelations?: number[];
        utilization?: number[];
    };
    filter?: "Today" | "This Week" | "This Month";
    onFilterChange?: (range: "Today" | "This Week" | "This Month") => void;
    onNavigateTo?: {
        revenue?: () => void;
        sessions?: () => void;
        cancelations?: () => void;
        utilization?: () => void;
    };
    loading?: boolean;
};

const KPIWidgetGroup: React.FC<KPIWidgetGroupProps> = ({
    stats,
    trends,
    trendLabels,
    sparklines,
    filter,
    onFilterChange,
    onNavigateTo,
    loading = false,
}) => {
    const filters: Array<"Today" | "This Week" | "This Month"> = [
        "Today",
        "This Week",
        "This Month",
    ];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="theme-heading text-lg font-semibold flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Key Performance Indicators
                </h3>

                {onFilterChange && (
                    <div className="flex items-center gap-2 text-sm font-medium text-muted">
                        {filters.map((range) => (
                            <button
                                key={range}
                                className={cn(
                                    "theme-filter-btn",
                                    filter === range && "theme-filter-active"
                                )}
                                onClick={() => onFilterChange(range)}>
                                {range}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <KPIWidget
                    title="Revenue"
                    value={stats.revenue}
                    trend={trends?.revenue}
                    trendLabel={trendLabels?.revenue}
                    sparkline={sparklines?.revenue}
                    icon={<Euro className="w-5 h-5" />}
                    iconPosition="top"
                    onClick={onNavigateTo?.revenue}
                    loading={loading}
                />
                <KPIWidget
                    title="Sessions Completed"
                    value={stats.sessions}
                    trend={trends?.sessions}
                    trendLabel={trendLabels?.sessions}
                    sparkline={sparklines?.sessions}
                    icon={<CalendarCheck className="w-5 h-5" />}
                    variant="success"
                    iconPosition="top"
                    onClick={onNavigateTo?.sessions}
                    loading={loading}
                />
                <KPIWidget
                    title="Cancelations"
                    value={stats.cancelations}
                    trend={trends?.cancelations}
                    trendLabel={trendLabels?.cancelations}
                    sparkline={sparklines?.cancelations}
                    icon={<XCircle className="w-5 h-5" />}
                    variant="warning"
                    iconPosition="top"
                    onClick={onNavigateTo?.cancelations}
                    loading={loading}
                />
                <KPIWidget
                    title="Utilization"
                    value={`${stats.utilization}%`}
                    trend={trends?.utilization}
                    trendLabel={trendLabels?.utilization}
                    sparkline={sparklines?.utilization}
                    icon={<PieChart className="w-5 h-5" />}
                    iconPosition="top"
                    onClick={onNavigateTo?.utilization}
                    loading={loading}
                />
            </div>
        </section>
    );
};

export default KPIWidgetGroup;
