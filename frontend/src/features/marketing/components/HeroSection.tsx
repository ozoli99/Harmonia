import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, PlayCircle, Rocket } from "lucide-react";
import { Button, BackgroundGlow, SectionHeader } from "kaida-ui";
import Lottie from "lottie-react";
import heroAnimation from "@assets/Hero_Animation.json";
import CountUp from "react-countup";

const HeroSection: React.FC = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-light dark:bg-surface-dark py-24 px-6 transition-all">
        {/* Background glow effects */}
        <BackgroundGlow
            position="top"
            size="80vw"
            blur="blur-[120px]"
            color="bg-primary/20 dark:bg-white/5"
            opacity={0.4}
        />
        <BackgroundGlow
            position="bottom"
            size="70vw"
            blur="blur-[100px]"
            color="bg-secondary/20 dark:bg-primary/10"
            opacity={0.3}
        />

        {/* Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            {/* Text Section */}
            <div className="text-center md:text-left">
                <SectionHeader
                    kicker="All-in-one appointment platform"
                    gradient={false}
                    animate
                    subtitle="Harmonia helps professionals automate bookings, manage clients, and get paid — beautifully and efficiently, from one dashboard.">
                    Run Your Business Smarter{" "}
                    <span className="block text-primary dark:text-secondary">
                        with Effortless Scheduling
                    </span>
                </SectionHeader>

                {/* CTA Buttons */}
                <motion.div
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}>
                    <Link to="/register">
                        <Button
                            size="lg"
                            icon={<Rocket className="w-5 h-5" />}
                            iconPosition="left"
                            className="btn-primary px-8 rounded-full shadow-xl">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Link to="/demo">
                        <Button
                            size="lg"
                            variant="ghost"
                            icon={<PlayCircle className="w-5 h-5" />}
                            iconPosition="left"
                            className="border border-primary/80 text-text-default dark:text-text-inverted hover:bg-primary hover:text-white dark:hover:bg-secondary px-8 rounded-full">
                            View Demo
                        </Button>
                    </Link>
                </motion.div>

                {/* Counter Section */}
                <motion.div
                    className="mt-10 text-center md:text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}>
                    <p className="text-base sm:text-lg text-text-muted dark:text-mutedDark">
                        Empowering over
                    </p>
                    <motion.span
                        className="text-4xl sm:text-5xl font-extrabold text-primary dark:text-secondary mt-1 block tracking-tight"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}>
                        <CountUp end={3200} duration={3} separator="," />+
                    </motion.span>
                    <p className="text-sm text-muted dark:text-mutedDark mt-1">
                        service professionals worldwide
                    </p>
                </motion.div>
            </div>

            {/* Animation Section */}
            <motion.div
                className="w-full max-w-md mx-auto md:mx-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}>
                <Lottie
                    animationData={heroAnimation}
                    loop
                    autoplay
                    className="w-full h-auto"
                />
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            className="absolute bottom-8 z-10 flex justify-center items-center w-10 h-10 rounded-full bg-surface-light/70 dark:bg-white/10 backdrop-blur-md shadow-md border border-primary/30 text-primary dark:text-secondary"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            aria-hidden>
            <ChevronDown className="w-5 h-5" />
        </motion.div>
    </section>
);

export default HeroSection;
