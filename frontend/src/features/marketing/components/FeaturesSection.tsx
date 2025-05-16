import React from "react";
import { motion } from "framer-motion";
import {
    BellAlertIcon,
    CalendarIcon,
    CreditCardIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { BackgroundGlow, SectionHeader } from "kaida-ui";

const features = [
    {
        title: "Smart Scheduling",
        description:
            "Manage your calendar, let clients self-book, reschedule, or cancel — all synced automatically.",
        icon: (
            <CalendarIcon className="w-12 h-12 text-primary dark:text-surface-light" />
        ),
    },
    {
        title: "Integrated Payments",
        description:
            "Enable secure online payments and automated invoicing to simplify your billing workflow.",
        icon: (
            <CreditCardIcon className="w-12 h-12 text-text dark:text-secondary" />
        ),
    },
    {
        title: "Powerful CRM Tools",
        description:
            "Track clients, communication history, preferences, and session notes in one unified system.",
        icon: (
            <UserIcon className="w-12 h-12 text-secondary dark:text-primary" />
        ),
    },
    {
        title: "Automated Reminders",
        description:
            "Minimize no-shows with SMS and email reminders tailored to your brand and schedule.",
        icon: (
            <BellAlertIcon className="w-12 h-12 text-primary dark:text-surface-light" />
        ),
    },
];

const FeaturesSection: React.FC = () => (
    <section className="relative py-section sm:py-32 md:py-40 overflow-hidden bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        {/* Background Glows */}
        <BackgroundGlow
            aria-hidden="true"
            position="top"
            size="80vw"
            blur="blur-[120px]"
            color="bg-primary/20 dark:bg-white/5"
            opacity={0.3}
        />
        <BackgroundGlow
            aria-hidden="true"
            position="bottom"
            size="70vw"
            blur="blur-[100px]"
            color="bg-secondary/20 dark:bg-primary/10"
            opacity={0.2}
        />

        <SectionHeader kicker="Core Features">
            Why Choose Harmonia?
        </SectionHeader>

        {/* Features Grid */}
        <div className="relative z-10 mt-16 sm:mt-20 px-container">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto sm:overflow-visible overflow-x-auto pb-4 sm:pb-0 snap-x sm:snap-none">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        className="min-w-[280px] sm:min-w-0 snap-start p-8 bg-white/60 dark:bg-surface-dark/60 rounded-2xl shadow-base border border-primary/30 dark:border-secondary/30 backdrop-blur-xl hover:scale-[1.03] hover:shadow-lg transition-transform flex flex-col items-center text-center relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: idx * 0.1,
                            duration: 0.6,
                            ease: "easeOut",
                        }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/5 dark:via-white/5 dark:to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="mb-6 p-5 bg-surface-light/70 dark:bg-base/70 rounded-full shadow-md backdrop-blur-md">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-text dark:text-text-inverted">
                            {feature.title}
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-text-muted dark:text-mutedDark leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default FeaturesSection;
