import React, { useState } from "react";
import { Megaphone, CalendarRange } from "lucide-react";
import { LoadingSkeleton } from "kaida-ui";
import RevenueTrendChart from "@features/dashboard/widgets/RevenueTrendChart";
import { mockRevenueData } from "@features/dashboard/constants/dashboardMocks";
import KPIWidgetGroup from "@features/dashboard/widgets/KPIWidgetGroup";

// Filter mapping (reusing the same strategy as in Analytics)
const KPI_TO_TREND: Record<
    "Today" | "This Week" | "This Month",
    "weekly" | "monthly" | "yearly"
> = {
    Today: "weekly",
    "This Week": "weekly",
    "This Month": "monthly",
};

const TREND_TO_KPI: Record<
    "weekly" | "monthly" | "yearly",
    "Today" | "This Week" | "This Month"
> = {
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Month",
};

const Marketing: React.FC = () => {
    const [kpiRange, setKpiRange] = useState<
        "Today" | "This Week" | "This Month"
    >("This Month");
    const trendRange = KPI_TO_TREND[kpiRange];
    const loading = false;

    return (
        <div className="p-8 space-y-10 min-h-screen bg-surfaceLight dark:bg-surfaceDark transition-colors">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Megaphone className="w-6 h-6 text-primary" />
                        Marketing Tools
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Review and optimize your marketing performance
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
                            revenue: "€3,700",
                            sessions: 25,
                            cancelations: 4,
                            nextGap: "11:00–13:30",
                            utilization: 61,
                        }}
                        trends={{
                            revenue: "+10%",
                            sessions: "+5%",
                            cancelations: "-1",
                            utilization: "+4%",
                        }}
                        trendLabels={{
                            revenue: "vs last month",
                            sessions: "vs last week",
                            cancelations: "vs last week",
                            utilization: "vs last month",
                        }}
                        sparklines={{
                            revenue: [2900, 3100, 3300, 3500, 3700],
                            sessions: [18, 19, 20, 22, 25],
                            cancelations: [5, 4, 4, 3, 4],
                            utilization: [50, 55, 57, 59, 61],
                        }}
                        filter={kpiRange}
                        onFilterChange={setKpiRange}
                        onNavigateTo={{
                            revenue: () =>
                                console.log("Open campaign revenue breakdown"),
                            sessions: () =>
                                console.log("Open campaign performance"),
                            cancelations: () =>
                                console.log("Show campaign churn"),
                            utilization: () =>
                                console.log("Show marketing ROI"),
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

export default Marketing;
