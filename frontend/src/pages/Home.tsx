import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Footer, Header } from "kaida-ui";
import HeroSection from "@features/marketing/components/HeroSection";
import FeaturesSection from "@features/marketing/components/FeaturesSection";
import PricingSection from "@features/marketing/components/PricingSection";
import TestimonialsSection from "@features/marketing/components/TestimonialsSection";
import FAQSection from "@features/marketing/components/FAQSection";
import CTASection from "@features/marketing/components/CTASection";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

const mainNav = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

const Home: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-surface text-body transition-colors duration-300 overflow-hidden">
            {/* Header */}
            <div className="header-container shadow-sm">
                <Header
                    brandName="Harmonia"
                    navItems={mainNav}
                    ctaButton={
                        <Link to="/login">
                            <Button
                                size="sm"
                                className="btn-primary rounded-full shadow-md">
                                Login
                            </Button>
                        </Link>
                    }
                    showDarkModeToggle
                    linkComponent={({ href, children, className }) => (
                        <a href={href} className={className}>
                            {children}
                        </a>
                    )}
                    navLinkClass="text-body hover:text-brand transition"
                />
            </div>

            {/* Main Marketing Sections */}
            <main>
                <Container disablePadding>
                    <HeroSection />
                    <section id="features">
                        <FeaturesSection />
                    </section>
                    <section id="pricing">
                        <PricingSection />
                    </section>
                    <section>
                        <TestimonialsSection />
                    </section>
                    <section id="faq">
                        <FAQSection />
                    </section>
                    <section>
                        <CTASection />
                    </section>
                </Container>
            </main>

            {/* Footer */}
            <Footer
                brandName="Harmonia"
                tagline="Designed for professionals who care about their clients."
                sections={[
                    {
                        title: "Quick Links",
                        links: mainNav.map(({ label, href }) => ({
                            label,
                            href,
                        })),
                    },
                ]}
                socials={[
                    { icon: <FaFacebookF size={16} />, href: "#" },
                    { icon: <FaTwitter size={16} />, href: "#" },
                    { icon: <FaInstagram size={16} />, href: "#" },
                    { icon: <FaLinkedinIn size={16} />, href: "#" },
                ]}
                className="bg-surface text-subtle border-t border-primary/10"
            />
        </div>
    );
};

export default Home;
