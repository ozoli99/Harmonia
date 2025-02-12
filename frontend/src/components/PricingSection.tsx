import React, { useState } from "react";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";

const PricingSection: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const plans = [
        { 
            title: "Starter", 
            subtitle: "For independent masseurs.", 
            price: { monthly: "$20/mo", yearly: "$200/yr" },
            features: ["Appointment Management", "Client Records", "Email Notifications"],
            gradient: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
        },
        { 
            title: "Professional", 
            subtitle: "For growing businesses.", 
            price: { monthly: "$40/mo", yearly: "$400/yr" },
            features: ["Everything in Starter", "Payment Processing", "SMS Notifications"],
            gradient: "from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700",
            highlight: true,
        },
        { 
            title: "Enterprise", 
            subtitle: "For large practices.", 
            price: { monthly: "$70/mo", yearly: "$700/yr" },
            features: ["Everything in Professional", "Multi-location Support", "Custom Integrations"],
            gradient: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
        },
    ];

    return (
        <section className="relative py-32 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-gray-50 dark:to-gray-800"></div>
            <motion.h2
                className="relative z-10 text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Find Your Perfect Plan
            </motion.h2>
            <p className="relative z-10 mt-4 text-lg text-gray-600 dark:text-gray-300">
                Flexible pricing to suit your business needs.
            </p>

            <div className="relative z-10 mt-8 flex justify-center">
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                    <button
                        className={`px-6 py-2 rounded-full transition-all ${
                            billingCycle === "monthly" ? "bg-blue-600 text-white" : "text-gray-900 dark:text-white"
                        }`}
                        onClick={() => setBillingCycle("monthly")}
                    >
                        Monthly
                    </button>
                    <button
                        className={`px-6 py-2 rounded-full transition-all ${
                            billingCycle === "yearly" ? "bg-blue-600 text-white" : "text-gray-900 dark:text-white"
                        }`}
                        onClick={() => setBillingCycle("yearly")}
                    >
                        Yearly <span className="text-xs ml-1 text-green-500">(Save 2 months)</span>
                    </button>
                </div>
            </div>

            <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 max-w-6xl mx-auto px-6">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={idx}
                        className={`p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-xl transition-all transform hover:scale-[1.05] hover:shadow-3xl
                        bg-gradient-to-br ${plan.gradient} ${plan.highlight ? "border-2 border-blue-500 dark:border-blue-400" : ""}`}
                        whileHover={{ scale: 1.07 }}
                    >
                        {plan.highlight && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 px-4 py-1 bg-blue-500 text-white text-sm rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">{plan.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.subtitle}</p>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={billingCycle}
                                className="text-4xl font-bold mt-6 text-gray-900 dark:text-white"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {plan.price[billingCycle]}
                            </motion.p>
                        </AnimatePresence>

                        <ul className="mt-6 text-gray-600 dark:text-gray-300 space-y-2 text-lg">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center justify-center gap-2">
                                    <span className="text-blue-500 dark:text-blue-400">✔</span> {feat}
                                </li>
                            ))}
                        </ul>

                        <Button className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 rounded-full text-lg shadow-xl transition-all">
                            Get Started
                        </Button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;