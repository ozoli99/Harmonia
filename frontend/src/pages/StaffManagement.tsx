import React, { useState } from "react";
import {
    PlusCircleIcon,
    TrashIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Modal } from "kaida-ui";

interface Staff {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Practitioner" | "Assistant";
}

const initialStaff: Staff[] = [
    { id: 1, name: "Anna Kovács", email: "anna@example.com", role: "Admin" },
    {
        id: 2,
        name: "Gábor Szalai",
        email: "gabor@example.com",
        role: "Practitioner",
    },
    {
        id: 3,
        name: "Zsófia Tóth",
        email: "zsofia@example.com",
        role: "Assistant",
    },
];

const StaffManagement: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    👥 Staff Management
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Staff
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#1A2A4A] text-left text-sm text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {staffList.map((staff) => (
                            <tr
                                key={staff.id}
                                className="text-gray-800 dark:text-gray-200 text-sm">
                                <td className="p-4 font-medium">
                                    {staff.name}
                                </td>
                                <td className="p-4">{staff.email}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white">
                                        {staff.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Placeholder Modal */}
            {showModal && (
                <Modal isOpen={true} onClose={() => setShowModal(false)}>
                    <motion.div
                        className="p-6 bg-white dark:bg-[#1A2A4A] rounded-xl max-w-md mx-auto text-gray-800 dark:text-white"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}>
                        <h2 className="text-xl font-semibold mb-4">
                            Add Staff Member
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This is just a placeholder. Connect this modal to a
                            form submission later.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full py-2 rounded-md bg-primary text-white hover:bg-primary/90">
                            Close
                        </button>
                    </motion.div>
                </Modal>
            )}
        </div>
    );
};

export default StaffManagement;
