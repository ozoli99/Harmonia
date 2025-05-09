import React, { useState } from "react";
import { Sliders, CalendarRange } from "lucide-react";
import { LoadingSkeleton, Toggle } from "kaida-ui";

const Customisation: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        darkMode: false,
        customBranding: true,
        emailReminders: true,
        smsReminders: false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-8 space-y-10 min-h-screen bg-surfaceLight dark:bg-surfaceDark transition-colors">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sliders className="w-6 h-6 text-primary" />
                        Customisation
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Personalize your experience and preferences
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarRange className="w-5 h-5 text-gray-500" />
                    <span>Last updated: Today</span>
                </div>
            </div>

            {loading ? (
                <LoadingSkeleton />
            ) : (
                <div className="space-y-6">
                    {/* Branding Options */}
                    <section className="bg-white dark:bg-[#1A2A4A] rounded-xl p-6 border border-gray-200 dark:border-[#3E4C75] shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Branding
                        </h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                                Enable Custom Branding
                            </span>
                            <Toggle
                                isOn={settings.customBranding}
                                onToggle={() => handleToggle("customBranding")}
                                ariaLabel="Enable Custom Branding"
                                size="sm"
                            />
                        </div>
                    </section>

                    {/* Appearance */}
                    <section className="bg-white dark:bg-[#1A2A4A] rounded-xl p-6 border border-gray-200 dark:border-[#3E4C75] shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Appearance
                        </h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                                Dark Mode
                            </span>
                            <Toggle
                                isOn={settings.darkMode}
                                onToggle={() => handleToggle("darkMode")}
                                ariaLabel="Dark Mode"
                                size="sm"
                            />
                        </div>
                    </section>

                    {/* Communication Preferences */}
                    <section className="bg-white dark:bg-[#1A2A4A] rounded-xl p-6 border border-gray-200 dark:border-[#3E4C75] shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Communication Preferences
                        </h2>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                                Email Reminders
                            </span>
                            <Toggle
                                isOn={settings.emailReminders}
                                onToggle={() => handleToggle("emailReminders")}
                                ariaLabel="Email Reminders"
                                size="sm"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                                SMS Reminders
                            </span>
                            <Toggle
                                isOn={settings.smsReminders}
                                onToggle={() => handleToggle("smsReminders")}
                                ariaLabel="SMS Reminders"
                                size="sm"
                            />
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Customisation;
