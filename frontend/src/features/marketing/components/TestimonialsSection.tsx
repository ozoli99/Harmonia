import React from "react";
import { Button, SectionHeader } from "kaida-ui";
import { Link } from "react-router-dom";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "../../../data/testimonials";

const TestimonialsSection: React.FC = () => {
    return (
        <section className="relative py-section bg-surface-light dark:bg-surface-dark transition-colors duration-300">
            <SectionHeader
                kicker="Testimonials"
                subtitle="What Professionals Say">
                What Professionals Say
            </SectionHeader>

            <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-container">
                {testimonials.map((t, idx) => (
                    <TestimonialCard key={idx} testimonial={t} index={idx} />
                ))}
            </div>

            <div className="mt-20 text-center">
                <Link to="/register">
                    <Button className="btn-primary text-lg px-8 py-4">
                        Join 3,000+ Happy Professionals
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default TestimonialsSection;
