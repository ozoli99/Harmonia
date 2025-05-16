import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "kaida-ui";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "@shared/utils/ui/cn";

type Plan = {
    title: string;
    subtitle: string;
    price: { monthly: string; yearly: string };
    features: string[];
    highlight?: boolean;
};

interface PricingCardProps {
    plan: Plan;
    billingCycle: "monthly" | "yearly";
    index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
    plan,
    billingCycle,
    index,
}) => (
    <motion.div
        className={cn(
            "relative p-10 rounded-2xl shadow-base border border-primary/20 dark:border-secondary/30 backdrop-blur-lg bg-surface-light dark:bg-surface-dark transition-transform hover:scale-[1.03]",
            plan.highlight &&
                "ring-2 ring-primary dark:ring-text-inverted shadow-lg"
        )}
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6 }}>
        {plan.highlight && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 px-4 py-1 bg-primary text-white text-sm rounded-full shadow-md flex items-center gap-1">
                <Star className="w-4 h-4" />
                Most Popular
            </div>
        )}

        <h3 className="text-3xl font-semibold text-text dark:text-text-inverted">
            {plan.title}
        </h3>
        <p className="mt-2 text-text-muted dark:text-mutedDark">
            {plan.subtitle}
        </p>

        <AnimatePresence mode="wait">
            <motion.p
                key={billingCycle}
                className="text-4xl font-bold mt-6 text-text dark:text-text-inverted"
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
);

export default PricingCard;
