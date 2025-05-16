export const pricingPlans = [
    {
        title: "Starter",
        subtitle: "For solo professionals just getting started.",
        price: { monthly: "$19/mo", yearly: "$190/yr" },
        features: ["Appointment Scheduling", "Client CRM", "Email Reminders"],
        highlight: false,
    },
    {
        title: "Professional",
        subtitle: "For teams or growing businesses.",
        price: { monthly: "$39/mo", yearly: "$390/yr" },
        features: [
            "Everything in Starter",
            "Payment Processing",
            "SMS Notifications",
            "Custom Branding",
        ],
        highlight: true,
    },
    {
        title: "Enterprise",
        subtitle: "For organizations with complex scheduling needs.",
        price: { monthly: "$69/mo", yearly: "$690/yr" },
        features: [
            "Everything in Professional",
            "Team Management",
            "Multi-location Support",
            "Priority Support",
        ],
        highlight: false,
    },
];
