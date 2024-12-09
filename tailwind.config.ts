import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF", // Beige for the main sidebar and background
        secondary: "#19b3a8",
        accent: "#F0F0F0", // Coral pink for action items

        highlight: "#FFF8F4", // Off-white for chat bubbles
        light: "#FFFFFF", // White for the background
        textGray: "#4D4D4D", // Dark gray for improved readability
        warning: "#FF6961", // Warmer red for warnings or errors
      },
    },
  },
  plugins: [],
};
export default config;
