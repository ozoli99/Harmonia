/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // Toggle dark mode via a `.dark` class
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./.yalc/kaida-ui/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        // ====== DESIGN TOKENS ======
        extend: {
            // 1) SPACING SCALE
            spacing: {
                4: "1rem",
                6: "1.5rem",
                8: "2rem",
                10: "2.5rem",
                12: "3rem",
                16: "4rem",
                // semantic
                section: "2rem",
                container: "1.25rem",
            },

            // 2) BORDER RADII
            borderRadius: {
                sm: "0.375rem",
                md: "0.75rem",
                lg: "1rem",
                xl: "1.5rem",
                "2xl": "2rem",
                full: "9999px",
            },

            // 3) FONT FAMILY
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                heading: ['"Work Sans"', "sans-serif"],
            },

            // 4) BOX SHADOWS
            boxShadow: {
                xs: "0 1px 2px rgba(0,0,0,0.05)",
                sm: "0 2px 4px rgba(0,0,0,0.06)",
                base: "0 2px 8px rgba(0,0,0,0.1)",
                md: "0 4px 12px rgba(0,0,0,0.12)",
                lg: "0 8px 24px rgba(0,0,0,0.15)",
                inset: "inset 0 1px 2px rgba(0,0,0,0.05)",
            },

            // 5) TYPOGRAPHY
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1rem" }],
                sm: ["0.875rem", { lineHeight: "1.25rem" }],
                base: ["1rem", { lineHeight: "1.5rem" }],
                lg: ["1.125rem", { lineHeight: "1.75rem" }],
                xl: ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                "5xl": ["3rem", { lineHeight: "1" }],
            },
            fontWeight: {
                hairline: "100",
                thin: "200",
                light: "300",
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
                extrabold: "800",
                black: "900",
            },

            // 6) COLOR PALETTE (logo-derived)
            colors: {
                // — BRAND ACCENTS —
                primary: {
                    DEFAULT: "#CFA15D", // soft gold
                    light: "#E4C68A",
                    dark: "#B58C4E",
                },
                secondary: {
                    DEFAULT: "#5D8FA6", // muted teal-blue
                    light: "#89AEC1",
                    dark: "#497790",
                },

                // — STATUS COLORS —
                success: {
                    DEFAULT: "#22C55E",
                    light: "#4ADE80",
                    dark: "#16A34A",
                },
                warning: {
                    DEFAULT: "#FBBF24",
                    light: "#FCD34D",
                    dark: "#D97706",
                },
                danger: {
                    DEFAULT: "#EF4444",
                    light: "#F87171",
                    dark: "#DC2626",
                },

                // — SURFACES & BACKGROUNDS —
                surface: {
                    light: "#F8F5F2", // paper-white
                    muted: "#E3E7EA", // cool alt
                    dark: "#0F1A27", // deep navy
                },
                // semantic background aliases
                background: {
                    DEFAULT: "#F8F5F2",
                    alt: "#E3E7EA",
                    dark: "#0F1A27",
                },

                // — TEXT & ICONS —
                text: {
                    DEFAULT: "#0C1B33", // deep navy
                    muted: "#6B7280", // gray-500
                    inverted: "#FFFFFF",
                },
            },

            // 7) CUSTOM ANIMATIONS
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                float: "float 6s ease-in-out infinite",
            },
        },
    },

    // ====== UTILITY PLUGINS ======
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        require("tailwind-scrollbar"),
        // custom component shortcuts:
        function ({ addComponents, theme }) {
            addComponents({
                // — Panel / Card —
                ".card": {
                    backgroundColor: theme("colors.surface.light"),
                    borderRadius: theme("borderRadius.lg"),
                    boxShadow: theme("boxShadow.base"),
                    padding: theme("spacing.6"),
                    ".dark &": {
                        backgroundColor: theme("colors.surface.dark"),
                    },
                },
                // — Header wrapper —
                ".header-container": {
                    backgroundColor: theme("colors.surface.muted"),
                    borderBottom: `1px solid ${theme("colors.surface.light")}`,
                    ".dark &": {
                        backgroundColor: theme("colors.surface.dark"),
                        borderColor: theme("colors.surface.dark"),
                    },
                },
                // — Buttons —
                ".btn-primary": {
                    "@apply inline-flex items-center justify-center font-medium rounded-md px-4 py-2":
                        {},
                    backgroundColor: theme("colors.primary.DEFAULT"),
                    color: theme("colors.text.inverted"),
                    "&:hover": {
                        backgroundColor: theme("colors.primary.dark"),
                    },
                },
                ".btn-secondary": {
                    "@apply inline-flex items-center justify-center font-medium rounded-md px-4 py-2":
                        {},
                    backgroundColor: theme("colors.secondary.DEFAULT"),
                    color: theme("colors.text.inverted"),
                    "&:hover": {
                        backgroundColor: theme("colors.secondary.dark"),
                    },
                },
                // — Status Badge —
                ".badge": {
                    "@apply inline-block text-xs font-semibold px-2 py-0.5 rounded-full":
                        {},
                    backgroundColor: theme("colors.secondary.light"),
                    color: theme("colors.text.DEFAULT"),
                },
            });
        },
    ],
};
