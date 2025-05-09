import React from "react";
import { motion } from "framer-motion";
import { ResponsiveLine } from "@nivo/line";

interface RevenueTrendChartProps {
    data: { [key: string]: { x: string; y: number }[] };
    filter: "weekly" | "monthly" | "yearly";
    onFilterChange: (value: "weekly" | "monthly" | "yearly") => void;
    isDarkMode: boolean;
}

const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
    data,
    filter,
    onFilterChange,
    isDarkMode,
}) => {
    const totalRevenue = data[filter].reduce((sum, d) => sum + d.y, 0);
    const chartData = data[filter];

    return (
        <motion.div
            className="theme-panel p-6 space-y-5 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold theme-heading">
                        📈 Revenue Trend
                    </h3>
                    <p className="text-sm theme-subtext">
                        Total: ${totalRevenue.toLocaleString()}
                    </p>
                </div>

                <select
                    className="theme-button-ghost px-3 py-1 text-sm"
                    value={filter}
                    onChange={(e) =>
                        onFilterChange(
                            e.target.value as "weekly" | "monthly" | "yearly"
                        )
                    }>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* Revenue Chart */}
            {chartData.length === 0 ? (
                <div className="h-52 flex items-center justify-center theme-subtext">
                    No revenue data available for this period.
                </div>
            ) : (
                <div className="h-52">
                    <ResponsiveLine
                        data={[{ id: "Revenue", data: chartData }]}
                        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", min: 0, max: "auto" }}
                        axisBottom={{ tickSize: 5, tickPadding: 5 }}
                        colors={[isDarkMode ? "#89AFC8" : "#CFA15D"]}
                        theme={{
                            axis: {
                                ticks: {
                                    line: {
                                        stroke: isDarkMode ? "#BBB" : "#444",
                                    },
                                    text: {
                                        fill: isDarkMode ? "#BBB" : "#444",
                                    },
                                },
                                legend: {
                                    text: {
                                        fill: isDarkMode ? "#EEE" : "#222",
                                    },
                                },
                            },
                            grid: {
                                line: {
                                    stroke: isDarkMode ? "#333" : "#DDD",
                                    strokeWidth: 1,
                                },
                            },
                            tooltip: {
                                container: {
                                    background: isDarkMode ? "#1F2937" : "#FFF",
                                    color: isDarkMode ? "#F9FAFB" : "#111",
                                },
                            },
                        }}
                        lineWidth={3}
                        pointSize={6}
                        yFormat={(value) => `$${value}`}
                        tooltip={({ point }) => (
                            <div
                                style={{
                                    padding: "6px 10px",
                                    background: isDarkMode ? "#1F2937" : "#FFF",
                                    color: isDarkMode ? "#F9FAFB" : "#111",
                                    borderRadius: 6,
                                    fontSize: 13,
                                }}>
                                <strong>{point.data.xFormatted}</strong>
                                <br />
                                Revenue:{" "}
                                <strong>${point.data.yFormatted}</strong>
                            </div>
                        )}
                        useMesh={true}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default RevenueTrendChart;
