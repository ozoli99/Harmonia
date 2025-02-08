import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <p className="text-gray-700">
                Here you can view your upcoming appointments and recent session summaries.
            </p>
            {/* Future components: Appointment List, Analytics, etc. */}
        </div>
    );
};

export default Dashboard;