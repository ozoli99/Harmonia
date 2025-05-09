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
        <div className="relative min-h-screen bg-background alt dark:bg-background-dark text-text-default dark:text-text-inverted transition-colors duration-300">
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
                />
            </div>

            <main>
                <Container disablePadding>
                    <HeroSection />
                    <section id="features">
                        <FeaturesSection />
                    </section>
                    <section id="pricing">
                        <PricingSection />
                    </section>
                    <TestimonialsSection />
                    <section id="faq">
                        <FAQSection />
                    </section>
                    <CTASection />
                </Container>
            </main>

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
                className="bg-surface-light dark:bg-surface-dark text-text-muted dark:text-text-inverted border-t border-primary/10"
            />
        </div>
    );
};

export default Home;
