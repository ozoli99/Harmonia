import React, { useState } from "react";
import { Button, BackgroundGlow, SectionHeader } from "kaida-ui";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "@shared/utils/ui/cn";

const PricingSection: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
        "monthly"
    );

    const plans = [
        {
            title: "Starter",
            subtitle: "For solo professionals just getting started.",
            price: { monthly: "$19/mo", yearly: "$190/yr" },
            features: [
                "Appointment Scheduling",
                "Client CRM",
                "Email Reminders",
            ],
            highlight: false,
        },
        {
            title: "Professional",
            subtitle: "For teams or growing businesses.",
            price: { monthly: "$39/mo", yearly: "$390/yr" },
            features: [
                "Everything in Starter",
                "Payment Processing",
                "SMS Notifications",
                "Custom Branding",
            ],
            highlight: true,
        },
        {
            title: "Enterprise",
            subtitle: "For organizations with complex scheduling needs.",
            price: { monthly: "$69/mo", yearly: "$690/yr" },
            features: [
                "Everything in Professional",
                "Team Management",
                "Multi-location Support",
                "Priority Support",
            ],
            highlight: false,
        },
    ];

    return (
        <section className="relative py-28 sm:py-32 bg-surface-light dark:bg-surface-dark transition-all">
            <BackgroundGlow
                position="top"
                size="80vw"
                blur="blur-[120px]"
                color="bg-primary/20 dark:bg-white/5"
                opacity={0.3}
            />
            <BackgroundGlow
                position="bottom"
                size="70vw"
                blur="blur-[100px]"
                color="bg-secondary/20 dark:bg-primary/10"
                opacity={0.2}
            />

            <SectionHeader
                kicker="Pricing & Plans"
                subtitle="Transparent pricing to support every stage of your growth">
                Find Your Perfect Plan
            </SectionHeader>

            {/* Billing Cycle Toggle */}
            <div className="mt-10 flex justify-center">
                <div className="flex items-center bg-surface-light dark:bg-base rounded-full p-1 shadow-sm border border-primary/20 dark:border-secondary/30">
                    {["monthly", "yearly"].map((cycle) => (
                        <button
                            key={cycle}
                            onClick={() =>
                                setBillingCycle(cycle as "monthly" | "yearly")
                            }
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                                billingCycle === cycle
                                    ? "bg-primary text-white shadow-md"
                                    : "text-text-muted dark:text-mutedDark"
                            )}>
                            {cycle === "monthly" ? "Monthly" : "Yearly"}
                            {cycle === "yearly" && (
                                <span className="text-xs ml-1 text-success">
                                    (Save 2 months)
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plan Cards */}
            <div className="mt-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={idx}
                        className={cn(
                            "relative p-10 rounded-2xl shadow-lg border border-primary/20 dark:border-secondary/30 backdrop-blur-lg bg-surface-light dark:bg-surface-dark transition-transform hover:scale-[1.03]",
                            plan.highlight &&
                                "ring-2 ring-primary dark:ring-text-inverted shadow-2xl"
                        )}
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}>
                        {plan.highlight && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 px-4 py-1 bg-primary text-white text-sm rounded-full shadow-md flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                Most Popular
                            </div>
                        )}

                        <h3 className="text-3xl font-semibold text-text-default dark:text-text-inverted">
                            {plan.title}
                        </h3>
                        <p className="text-text-muted dark:text-mutedDark mt-2">
                            {plan.subtitle}
                        </p>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={billingCycle}
                                className="text-4xl font-bold mt-6 text-text-default dark:text-text-inverted"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}>
                                {plan.price[billingCycle]}
                            </motion.p>
                        </AnimatePresence>

                        <ul className="mt-6 text-text-muted dark:text-mutedDark space-y-3 text-base text-left max-w-xs mx-auto">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <Button className="mt-8 w-full btn-primary text-lg py-3">
                            Get Started
                        </Button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;
