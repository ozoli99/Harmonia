import React from "react";
import Container from "../components/Container";
import HeroSection from "../components/HeroSection"
import FeaturesSection from "../components/FeaturesSection";
import PricingSection from "../components/PricingSection";
  
const Home: React.FC = () => {
    return (
        <Container disablePadding className="relative py-20">
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white transition-all duration-500">
                <HeroSection />
                <FeaturesSection />
                <PricingSection />
            </div>
        </Container>
    );
};

export default Home;