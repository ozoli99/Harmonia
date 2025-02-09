import React, { useState } from 'react';

interface Service {
    id: number;
    name: string;
    description: string;
    duration: string;
    price: string;
}

const dummyServices: Service[] = [
    { id: 1, name: 'Swedish Massage', description: 'A relaxing massage to ease tension.', duration: '60 mins', price: '$50' },
    { id: 2, name: 'Deep Tissue Massage', description: 'Focus on deep muscle layers.', duration: '60 mins', price: '$70' },
];

const ServiceMenu: React.FC = () => {
    const [services, setServices] = useState<Service[]>(dummyServices);
    const [newService, setNewService] = useState<Service>({
        id: 0,
        name: '',
        description: '',
        duration: '',
        price: ''
    });

    const handleAddService = () => {
        if (newService.name && newService.price) {
            const serviceToAdd = { ...newService, id: Date.now() };
            setServices([...services, serviceToAdd]);
            setNewService({ id: 0, name: '', description: '', duration: '', price: '' });
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Service Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition transform hover:scale-105">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{service.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{service.description}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Duration: {service.duration}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Price: {service.price}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add New Service</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Service Name"
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder="Service Description"
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <input
                        type="text"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        placeholder="Duration (e.g., 60 mins)"
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        placeholder="Price (e.g., $50)"
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleAddService}
                    className="mt-4 w-full py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add Service
                </button>
            </div>
        </div>
    );
};

export default ServiceMenu;