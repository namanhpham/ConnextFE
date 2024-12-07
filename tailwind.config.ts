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
        primary: "#03122F",
        secondary: "#19305C",
        accent: "#413B61",
        highlight: "#AE7DAC",
        light: "#F3DADF",
        warning: "#F1916D",
      },
    },
  },
  plugins: [],
};
export default config;
