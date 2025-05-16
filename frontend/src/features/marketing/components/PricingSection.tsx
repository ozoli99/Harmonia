import React, { useState } from "react";
import { BackgroundGlow, SectionHeader } from "kaida-ui";
import BillingToggle from "./BillingToggle";
import PricingCard from "./PricingCard";
import { pricingPlans } from "../../../data/pricingPlans";

const PricingSection: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
        "monthly"
    );

    return (
        <section className="relative py-section bg-surface transition-colors duration-300">
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

            <div className="mt-10 flex justify-center">
                <BillingToggle
                    value={billingCycle}
                    onChange={setBillingCycle}
                />
            </div>

            <div className="mt-16 px-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {pricingPlans.map((plan, idx) => (
                    <PricingCard
                        key={idx}
                        plan={plan}
                        billingCycle={billingCycle}
                        index={idx}
                    />
                ))}
            </div>
        </section>
    );
};

export default PricingSection;
