import React from 'react';

const AnalyticsDashboard: React.FC = () => {
    const metrics = [
        { id: 1, title: "Appointments", value: 42 },
        { id: 2, title: "Revenue", value: "$3,200" },
        { id: 3, title: "Client Retention", value: "87%" },
    ];

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition transform hover:scale-105">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{metric.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;