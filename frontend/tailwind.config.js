/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./.yalc/kaida-ui/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                section: "7rem",
                content: "1.25rem",
            },
            borderRadius: {
                sm: "0.375rem",
                md: "0.75rem",
                lg: "1rem",
                xl: "1.5rem",
                "2xl": "2rem",
                full: "9999px",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                heading: ['"Work Sans"', "sans-serif"],
            },
            boxShadow: {
                xs: "0 1px 2px rgba(0,0,0,0.05)",
                sm: "0 2px 4px rgba(0,0,0,0.06)",
                base: "0 2px 8px rgba(0,0,0,0.1)",
                md: "0 4px 12px rgba(0,0,0,0.12)",
                lg: "0 8px 24px rgba(0,0,0,0.15)",
                inset: "inset 0 1px 2px rgba(0,0,0,0.05)",
            },
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
            colors: {
                // neutrals
                background: {
                    DEFAULT: "#F8F5F2",
                    dark: "#0F1A27",
                    alt: "#E3E7EA",
                },
                surface: {
                    light: "#FFFFFF", //"#F8F5F2",
                    dark: "#1A2635", //"#0F1A27",
                    muted: "#E3E7EA",
                },
                text: {
                    DEFAULT: "#0C1B33",
                    inverted: "#FFFFFF",
                    muted: "#6B7280",
                    subtle: "#9CA3AF",
                },
                primary: {
                    DEFAULT: "#CFA15D",
                    light: "#E4C68A",
                    dark: "#B58C4E",
                },
                secondary: {
                    DEFAULT: "#5D8FA6",
                    light: "#89AEC1",
                    dark: "#497790",
                },
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
                muted: "#F3F4F6",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                softPulse: {
                    "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
                    "50%": { boxShadow: "0 0 0 6px rgba(34, 197, 94, 0)" },
                },
                dropdownIn: {
                    from: { opacity: "0", transform: "translateY(-4px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                dropdownOut: {
                    from: { opacity: "1", transform: "translateY(0)" },
                    to: { opacity: "0", transform: "translateY(-4px)" },
                },
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                softPulse: "softPulse 2.5s ease-in-out infinite",
                dropdownIn: "dropdownIn 0.2s ease-out forwards",
                dropdownOut: "dropdownOut 0.15s ease-in forwards",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        require("tailwind-scrollbar"),
        function ({ addComponents, theme }) {
            addComponents({
                ".layout-sidebar": {
                    backgroundColor: theme("colors.secondary.dark"),
                    color: theme("colors.text.inverted"),
                    width: "16rem",
                    minHeight: "100vh",
                    padding: theme("spacing.4"),
                },
                ".layout-content": {
                    backgroundColor: theme("colors.background.DEFAULT"),
                    color: theme("colors.text.DEFAULT"),
                    flexGrow: "1",
                    padding: theme("spacing.6"),
                },
                ".layout-details": {
                    backgroundColor: theme("colors.surface.light"),
                    borderLeft: `1px solid ${theme("colors.background.alt")}`,
                    width: "20rem",
                    minHeight: "100vh",
                    padding: theme("spacing.4"),
                    ".dark &": {
                        backgroundColor: theme("colors.surface.dark"),
                    },
                },
                ".card": {
                    backgroundColor: theme("colors.surface.light"),
                    borderRadius: theme("borderRadius.lg"),
                    boxShadow: theme("boxShadow.base"),
                    padding: theme("spacing.6"),
                    ".dark &": {
                        backgroundColor: theme("colors.surface.dark"),
                    },
                },
                ".header-container": {
                    backgroundColor: theme("colors.surface.muted"),
                    borderBottom: `1px solid ${theme("colors.surface.light")}`,
                    ".dark &": {
                        backgroundColor: theme("colors.surface.dark"),
                        borderColor: theme("colors.surface.dark"),
                    },
                },
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
                ".badge": {
                    "@apply inline-block text-xs font-semibold px-2 py-0.5 rounded-full":
                        {},
                    backgroundColor: theme("colors.secondary.light"),
                    color: theme("colors.text.DEFAULT"),
                },
            });
        },
    ],
    safelist: [
        {
            pattern:
                /(bg|text|border)-(primary|secondary|success|warning|danger)(-(light|dark))?/,
            variants: ["dark", "hover"],
        },
        {
            pattern: /(border-l)-(primary|secondary|success|warning|danger)/,
            variants: ["dark", "hover"],
        },
        {
            pattern: /data-\[highlighted\].*/,
        },
    ],
};
