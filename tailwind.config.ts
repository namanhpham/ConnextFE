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
        primary: "#F7E7D4", // Beige for the main sidebar and background
        secondary: "#F4C7C3", // Muted pink for headers or highlights
        accent: "#E89BA6", // Coral pink for action items
        highlight: "#FFF8F4", // Off-white for chat bubbles
        light: "#FFFFFF", // White for the background
        text: "#4A4A4A", // Dark gray for improved readability
        warning: "#FF6961", // Warmer red for warnings or errors
      },
    },
  },
  plugins: [],
};
export default config;
