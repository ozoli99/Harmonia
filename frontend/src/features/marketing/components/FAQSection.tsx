import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "kaida-ui";

const faqs = [
    {
        question: "Can I use Harmonia with multiple team members?",
        answer: "Absolutely. Harmonia supports multi-staff scheduling with independent availability, calendars, and permissions.",
    },
    {
        question: "Is there a free trial available?",
        answer: "Yes! You can try Harmonia completely free for 14 days with full access to all core features. No credit card required.",
    },
    {
        question: "How do payments work?",
        answer: "Harmonia integrates with Stripe to handle secure card payments, recurring billing, and invoicing — all in one place.",
    },
    {
        question: "Can I use Harmonia on mobile?",
        answer: "Definitely. Harmonia is fully responsive and optimized for mobile, tablet, and desktop devices alike.",
    },
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative py-28 sm:py-32 bg-surface-light dark:bg-surface-dark transition-colors">
            <SectionHeader>Frequently Asked Questions</SectionHeader>

            <div className="max-w-3xl mx-auto px-6 space-y-6">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <motion.div
                            key={index}
                            className="rounded-xl border border-primary/20 dark:border-secondary/30 bg-white/70 dark:bg-surface-dark/50 backdrop-blur-md shadow-md transition-all overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}>
                            <button
                                className="flex justify-between items-center w-full p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${index}`}
                                id={`faq-question-${index}`}>
                                <span className="text-base sm:text-lg font-medium text-text-default dark:text-text-inverted">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{
                                        rotate: isOpen ? 180 : 0,
                                        scale: isOpen ? 1.1 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}>
                                    <ChevronDown className="w-5 h-5 text-primary dark:text-secondary" />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        id={`faq-answer-${index}`}
                                        role="region"
                                        aria-labelledby={`faq-question-${index}`}
                                        initial={{ maxHeight: 0, opacity: 0 }}
                                        animate={{ maxHeight: 300, opacity: 1 }}
                                        exit={{ maxHeight: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut",
                                        }}
                                        className="px-5 pb-5 text-text-muted dark:text-mutedDark text-base sm:text-lg leading-relaxed overflow-hidden">
                                        <p>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default FAQSection;
