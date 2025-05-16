import React, { useState } from "react";
import { SectionHeader } from "kaida-ui";
import { faqs } from "../../../data/faqs";
import FAQItem from "./FAQItem";

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative py-section bg-surface-light dark:bg-surface-dark transition-colors duration-300">
            <SectionHeader>Frequently Asked Questions</SectionHeader>

            <div className="max-w-3xl mx-auto px-container space-y-6">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        index={index}
                        isOpen={openIndex === index}
                        onToggle={() =>
                            setOpenIndex(openIndex === index ? null : index)
                        }
                        question={faq.question}
                        answer={faq.answer}
                    />
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
