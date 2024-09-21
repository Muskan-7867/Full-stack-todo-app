import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode using the 'class' strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        // Adding fade-in animation to the theme
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" }, // Ensure opacity values are strings
          "100%": { opacity: "1" }, // Ensure opacity values are strings
        },
      },
      colors: {
        // Custom colors for light and dark modes
        "sky-900": "#0c4a6e",
        "gray-100": "#f3f4f6",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
        "yellow-400": "#facc15",
        "gray-300": "#d1d5db",
        "gray-600": "#4b5563",
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
};

export default config;
