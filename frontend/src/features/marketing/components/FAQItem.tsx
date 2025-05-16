import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    index: number;
    onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
    question,
    answer,
    isOpen,
    index,
    onToggle,
}) => {
    return (
        <motion.div
            className="faq-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}>
            <button
                className="faq-toggle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}>
                <span className="faq-question">{question}</span>
                <motion.div
                    animate={{
                        rotate: isOpen ? 180 : 0,
                        scale: isOpen ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}>
                    <ChevronDown className="icon" />
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
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="faq-answer">
                        <p>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FAQItem;
