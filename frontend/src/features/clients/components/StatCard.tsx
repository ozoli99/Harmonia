import React from "react";

const StatCard = ({ title, value }: { title: string; value: number }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-bold text-[#CFA15D]">{value}</p>
    </div>
);

export default StatCard;
