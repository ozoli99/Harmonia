import React from "react";
import { motion } from "framer-motion";

interface Offer {
    id: number;
    title: string;
    description: string;
}

interface OffersWidgetProps {
    offers: Offer[];
    onViewAll: () => void;
}

const OffersWidget: React.FC<OffersWidgetProps> = ({ offers, onViewAll }) => {
    return (
        <motion.div
            className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Special Offers &amp; Reminders
            </h3>
            {offers.map((offer) => (
                <div key={offer.id} className="flex flex-col">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {offer.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {offer.description}
                    </p>
                </div>
            ))}
            <motion.button
                className="text-blue-500 hover:text-blue-600 text-sm"
                whileTap={{ scale: 0.95 }}
                onClick={onViewAll}>
                View All Offers
            </motion.button>
        </motion.div>
    );
};

export default OffersWidget;
