import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export interface Testimonial {
    name: string;
    role: string;
    quote: string;
    stars: number;
    avatar?: string;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    testimonial,
    index,
}) => {
    const { name, role, quote, stars, avatar } = testimonial;

    return (
        <motion.div
            className="relative group p-[2px] rounded-xl bg-gradient-to-br from-primary/40 to-secondary/40 hover:from-primary/60 hover:to-secondary/60 transition-all"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                delay: index * 0.2,
                duration: 0.8,
                ease: "easeOut",
            }}>
            <div className="bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md border border-primary/30 dark:border-secondary/30 rounded-xl p-8 shadow-base hover:shadow-md transition-all duration-300 relative z-10 group-hover:scale-[1.01]">
                {/* Quotation mark */}
                <div className="absolute -top-6 left-6 text-7xl font-serif text-primary/10 dark:text-secondary/10 select-none pointer-events-none z-0">
                    &ldquo;
                </div>

                <blockquote className="text-base sm:text-lg text-text dark:text-mutedDark leading-relaxed italic relative z-10">
                    “{quote}”
                </blockquote>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-4 mb-2 text-primary dark:text-secondary">
                    {Array.from({ length: stars }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.3 + i * 0.1,
                                duration: 0.4,
                                ease: "easeOut",
                            }}>
                            <Star className="w-4 h-4 fill-current" />
                        </motion.div>
                    ))}
                </div>

                {/* Name & role */}
                <div className="flex items-center gap-3 mt-4">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary text-white dark:bg-secondary flex items-center justify-center text-sm font-bold shadow-sm">
                            {name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                        </div>
                    )}

                    <div className="text-left">
                        <p className="text-sm font-semibold text-text dark:text-text-inverted">
                            {name}
                        </p>
                        <p className="text-sm italic text-text-muted dark:text-mutedDark">
                            {role}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TestimonialCard;
