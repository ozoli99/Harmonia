import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const CTASection: React.FC = () => (
    <section className="py-20 text-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white">
        <h2 className="text-5xl font-bold">
            Ready to Elevate Your Wellness Business?
        </h2>
        <p className="mt-4 text-lg">
            Join the professionals using Harmonia to streamline their practice and grow.
        </p>
        <div className="mt-6">
            <Link to="/login">
                <Button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Started Now
                </Button>
            </Link>
        </div>
    </section>
);

export default CTASection;