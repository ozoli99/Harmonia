import React from "react";
import { motion } from "framer-motion";

const ProblemSection: React.FC = () => (
    <section className="py-20 text-center bg-gray-50 dark:bg-gray-900">
        <motion.h2
            className="text-5xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            Running a Wellness Business Shouldn’t Feel Overwhelming
        </motion.h2>
        <motion.p
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
            Managing bookings, handling payments, and keeping track of client needs is stressful. Let’s change that.
        </motion.p>
    </section>
);

export default ProblemSection;