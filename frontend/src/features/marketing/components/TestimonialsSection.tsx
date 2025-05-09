import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, SectionHeader } from "kaida-ui";
import { cn } from "@shared/utils/ui/cn";

const testimonials = [
    {
        name: "Dr. Sofia Bennett",
        role: "Dermatologist, Wellness Studio",
        quote: "Harmonia changed how we handle bookings...",
        stars: 5,
        avatar: "https://i.pravatar.cc/100?img=10",
    },
    {
        name: "Alex Rios",
        role: "Fitness Coach, FlexPro Gym",
        quote: "The platform is smooth and professional...",
        stars: 5,
        avatar: "https://i.pravatar.cc/100?img=33",
    },
    {
        name: "Maya Chen",
        role: "Therapist, Mindful Balance",
        quote: "What I love most is how easy it is...",
        stars: 5,
        avatar: "",
    },
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="relative py-32 bg-surface-light dark:bg-surface-dark transition-all">
            <SectionHeader
                kicker="Testimonials"
                subtitle="What Professionals Say">
                What Professionals Say
            </SectionHeader>

            <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
                {testimonials.map((t, idx) => (
                    <motion.div
                        key={idx}
                        className="relative group p-[2px] rounded-xl bg-gradient-to-br from-primary/40 to-secondary/40 hover:from-primary/60 hover:to-secondary/60 transition-all"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: idx * 0.2,
                            duration: 0.8,
                            ease: "easeOut",
                        }}>
                        <div className="bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md border border-primary/30 dark:border-secondary/30 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10 group-hover:scale-[1.01]">
                            {/* Quotation mark */}
                            <div className="absolute -top-6 left-6 text-7xl font-serif text-primary/10 dark:text-secondary/10 select-none pointer-events-none z-0">
                                &ldquo;
                            </div>

                            <blockquote className="text-base sm:text-lg text-text-default dark:text-mutedDark leading-relaxed italic relative z-10">
                                “{t.quote}”
                            </blockquote>

                            {/* Stars */}
                            <div className="flex items-center gap-1 mt-4 mb-2 text-primary dark:text-secondary">
                                {Array.from({ length: t.stars }).map((_, i) => (
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

                            {/* Name & Role */}
                            <div className="flex items-center gap-3 mt-4">
                                {t.avatar ? (
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full object-cover shadow-md"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary text-white dark:bg-secondary flex items-center justify-center text-sm font-bold shadow-md">
                                        {t.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>
                                )}

                                <div className="text-left">
                                    <p className="text-sm font-semibold text-text-default dark:text-text-inverted">
                                        {t.name}
                                    </p>
                                    <p className="text-sm italic text-text-muted dark:text-mutedDark">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-20 text-center">
                <Link
                    to="/register"
                    aria-label="Join over 3,000 professionals using Harmonia">
                    <Button className="btn-primary text-lg px-8 py-4">
                        Join 3,000+ Happy Professionals
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default TestimonialsSection;
