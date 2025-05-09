import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BackgroundGlow, Button, SectionHeader } from "kaida-ui";

const CTASection: React.FC = () => (
    <section className="relative py-28 sm:py-32 text-center bg-surface-light dark:bg-surface-dark transition-colors overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <BackgroundGlow
                position="top"
                size="70vw"
                blur="blur-[100px]"
                color="bg-primary/20 dark:bg-white/5"
                opacity={0.3}
            />
        </div>

        {/* Content */}
        <motion.div
            className="relative z-10 max-w-3xl mx-auto px-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}>
            <SectionHeader subtitle="Harmonia is the smart choice for professionals who want to spend less time managing tasks and more time doing what they love.">
                Ready to Transform Your Client Experience?
            </SectionHeader>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/register">
                        <Button
                            size="lg"
                            variant="default"
                            className="rounded-full px-8 py-4 text-lg shadow-md">
                            Create Your Free Account
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/demo">
                        <Button
                            size="lg"
                            variant="ghost"
                            className="rounded-full px-8 py-4 text-lg border border-primary text-primary dark:text-secondary dark:border-secondary hover:bg-primary/10 dark:hover:bg-secondary/10">
                            Explore the Platform
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    </section>
);

export default CTASection;
