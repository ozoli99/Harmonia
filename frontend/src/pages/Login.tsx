import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const Login: React.FC = () => {
    const [darkMode, setDarkMode] = React.useState(false);

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    // Mouse-based parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 40, damping: 15 });
    const smoothY = useSpring(mouseY, { stiffness: 40, damping: 15 });

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative min-h-screen flex flex-col lg:flex-row transition-colors duration-700 bg-gradient-to-br from-[#FDFCFB] to-[#F5F5F5] dark:from-[#0C1B33] dark:to-[#1A2A4A] overflow-hidden">
            {/* Theme toggle */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white dark:bg-[#0C1B33] shadow-md transition">
                {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                    <Moon className="w-5 h-5 text-blue-800" />
                )}
            </motion.button>

            {/* Left side with interactive parallax blobs */}
            <div className="relative flex-1 hidden lg:flex items-center justify-center overflow-hidden">
                {/* Front Blob */}
                <motion.div
                    className="absolute z-30 w-[400px] h-[400px] bg-[#CFA15D] opacity-80 rounded-full blur-[80px] pointer-events-none"
                    style={{
                        x: useTransform(smoothX, [-0.5, 0.5], [-50, 50]),
                        y: useTransform(smoothY, [-0.5, 0.5], [-50, 50]),
                        rotateX: useTransform(smoothY, [-0.5, 0.5], [10, -10]),
                        rotateY: useTransform(smoothX, [-0.5, 0.5], [-10, 10]),
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Middle Blob */}
                <motion.div
                    className="absolute z-20 top-20 left-40 w-[300px] h-[300px] bg-[#F2C66D] opacity-80 rounded-full blur-[80px] pointer-events-none"
                    style={{
                        x: useTransform(smoothX, [-0.5, 0.5], [30, -30]),
                        y: useTransform(smoothY, [-0.5, 0.5], [-30, 30]),
                        rotateX: useTransform(smoothY, [-0.5, 0.5], [6, -6]),
                        rotateY: useTransform(smoothX, [-0.5, 0.5], [-6, 6]),
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Background Blob */}
                <motion.div
                    className="absolute z-10 bottom-10 right-20 w-[350px] h-[350px] bg-[#89AFC8] opacity-80 rounded-full blur-[80px] pointer-events-none"
                    style={{
                        x: useTransform(smoothX, [-0.5, 0.5], [-20, 20]),
                        y: useTransform(smoothY, [-0.5, 0.5], [20, -20]),
                        rotateX: useTransform(smoothY, [-0.5, 0.5], [4, -4]),
                        rotateY: useTransform(smoothX, [-0.5, 0.5], [-4, 4]),
                    }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Welcome Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white text-center max-w-md z-40">
                    <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md">
                        Welcome to Harmonia
                    </h2>
                    <p className="text-lg opacity-90">
                        Your all-in-one appointment platform.
                    </p>
                </motion.div>
            </div>

            {/* Right side with SignIn */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1 h-screen flex items-center justify-center bg-white/80 dark:bg-[#1A2A4A]/80 backdrop-blur-xl shadow-2xl border-l border-[#CFA15D]/20 dark:border-[#89AFC8]/20 rounded-none lg:rounded-l-2xl">
                <SignIn
                    path="/login"
                    routing="path"
                    redirectUrl="/dashboard"
                    appearance={{
                        variables: {
                            colorPrimary: "#CFA15D",
                            fontSize: "14px",
                            borderRadius: "0.5rem",
                        },
                        elements: {
                            rootBox: "w-full max-w-md",
                            card: "bg-white dark:bg-[#1A2A4A] text-[#0C1B33] dark:text-white shadow-none border-none",

                            header: "mb-4",
                            headerTitle:
                                "text-2xl font-bold text-[#0C1B33] dark:text-white",
                            headerSubtitle:
                                "text-sm text-gray-600 dark:text-gray-400",

                            form: "space-y-4 w-full",
                            formField: "space-y-2",
                            formFieldLabel:
                                "text-sm font-medium text-gray-700 dark:text-gray-300",
                            formFieldInput:
                                "bg-white dark:bg-[#0C1B33] text-[#0C1B33] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-[#4F6272] rounded-md px-3 py-2 text-sm focus:ring-[#CFA15D] focus:border-[#CFA15D]",

                            formButtonPrimary:
                                "w-full bg-[#CFA15D] hover:bg-[#b68c4f] text-white font-semibold px-6 py-3 rounded-md shadow transition-all",

                            socialButtonsBlockButton:
                                "w-full bg-white dark:bg-[#0C1B33] text-[#0C1B33] dark:text-white border border-gray-300 dark:border-[#4F6272] px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all mb-2 last:mb-0",

                            footer: "text-sm text-gray-600 dark:text-gray-400 mt-4",
                            footerActionText: "text-[#CFA15D] hover:underline",

                            identityPreviewText:
                                "text-[#0C1B33] dark:text-white",
                            identityPreview:
                                "bg-gray-100 dark:bg-[#0C1B33] border border-gray-300 dark:border-[#4F6272]",
                        },
                    }}
                />
            </motion.div>
        </motion.section>
    );
};

export default Login;
