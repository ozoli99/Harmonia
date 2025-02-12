import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon, CreditCardIcon, UserIcon } from "@heroicons/react/24/outline";

const FeaturesSection: React.FC = () => {
    const features = [
        { 
            title: "Effortless Scheduling", 
            description: "Clients can book appointments easily while you stay in control of your availability.", 
            icon: <CalendarIcon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
        },
        { 
            title: "Secure Payments", 
            description: "Integrated payment gateway for seamless transactions and invoicing.", 
            icon: <CreditCardIcon className="w-12 h-12 text-purple-500 dark:text-purple-400" />
        },
        { 
            title: "Client Management", 
            description: "Track client preferences, session notes, and treatment plans effortlessly.", 
            icon: <UserIcon className="w-12 h-12 text-green-500 dark:text-green-400" />
        },
    ];
  
    return (
        <section className="relative py-32 md:py-40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 to-purple-300/10 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-3xl rounded-lg"></div>
            <motion.h2
                className="relative z-10 text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Why Choose Harmonia?
            </motion.h2>

            <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 max-w-6xl mx-auto px-6">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        className="p-12 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-2xl backdrop-blur-xl border border-gray-300 dark:border-gray-700 transition-all transform hover:scale-[1.06] hover:shadow-3xl flex flex-col items-center text-center relative overflow-hidden"
                        whileHover={{ scale: 1.07 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/5 dark:via-gray-700/10 dark:to-gray-900/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="mb-6 flex items-center justify-center p-5 bg-white/60 dark:bg-gray-700/60 rounded-full shadow-xl backdrop-blur-md">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>                        
                        <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed text-lg">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;