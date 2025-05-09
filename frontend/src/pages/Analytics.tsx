import React, { useState } from "react";
import { BarChartBig, CalendarRange } from "lucide-react";
import KPIWidgetGroup from "@features/dashboard/widgets/KPIWidgetGroup";
import RevenueTrendChart from "@features/dashboard/widgets/RevenueTrendChart";
import { LoadingSkeleton } from "kaida-ui";
import { mockRevenueData } from "@features/dashboard/constants/dashboardMocks";

// Mapping between KPI and Chart filters
const KPI_TO_TREND: Record<
    "Today" | "This Week" | "This Month",
    "weekly" | "monthly" | "yearly"
> = {
    Today: "weekly", // Use weekly as fallback for "Today"
    "This Week": "weekly",
    "This Month": "monthly",
};

const TREND_TO_KPI: Record<
    "weekly" | "monthly" | "yearly",
    "Today" | "This Week" | "This Month"
> = {
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Month", // fallback for unsupported range
};

const Analytics: React.FC = () => {
    const [kpiRange, setKpiRange] = useState<
        "Today" | "This Week" | "This Month"
    >("This Month");

    const trendRange = KPI_TO_TREND[kpiRange];
    const loading = false; // Replace with actual loading state if needed

    return (
        <div className="p-8 space-y-10 min-h-screen bg-surfaceLight dark:bg-surfaceDark transition-colors">
            {/* Temporary Page Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChartBig className="w-6 h-6 text-primary" />
                        Analytics & Reports
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track performance and business insights
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarRange className="w-5 h-5 text-gray-500" />
                    <span>{kpiRange}</span>
                </div>
            </div>

            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    <KPIWidgetGroup
                        stats={{
                            revenue: "€4,200",
                            sessions: 32,
                            cancelations: 3,
                            nextGap: "12:30–14:00",
                            utilization: 68,
                        }}
                        trends={{
                            revenue: "+15%",
                            sessions: "+7%",
                            cancelations: "-2",
                            utilization: "+5%",
                        }}
                        trendLabels={{
                            revenue: "vs last month",
                            sessions: "vs last week",
                            cancelations: "vs last week",
                            utilization: "vs last month",
                        }}
                        sparklines={{
                            revenue: [3200, 3500, 3400, 3900, 4200],
                            sessions: [22, 25, 28, 30, 32],
                            cancelations: [5, 4, 4, 3, 3],
                            utilization: [60, 62, 65, 66, 68],
                        }}
                        filter={kpiRange}
                        onFilterChange={setKpiRange}
                        onNavigateTo={{
                            revenue: () => console.log("Go to revenue details"),
                            sessions: () =>
                                console.log("Go to session history"),
                            cancelations: () =>
                                console.log("Go to cancelation stats"),
                            utilization: () =>
                                console.log("Go to utilization breakdown"),
                        }}
                        loading={false}
                    />

                    <RevenueTrendChart
                        data={mockRevenueData}
                        filter={trendRange}
                        onFilterChange={(val) => setKpiRange(TREND_TO_KPI[val])}
                        isDarkMode={false}
                    />
                </>
            )}
        </div>
    );
};

export default Analytics;
