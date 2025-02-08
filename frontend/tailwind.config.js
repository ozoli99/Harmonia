/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        harmoniaBlue: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        harmoniaGray: {
          light: "#f3f4f6",
          DEFAULT: "#9ca3af",
          dark: "#4b5563",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}