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
        telegram: {
          bg: "#0f0f14",
          card: "#1a1a24",
          accent: "#2aabee",
          gold: "#f5c542",
        },
      },
      boxShadow: {
        tap: "0 0 40px rgba(42, 171, 238, 0.35)",
        gold: "0 0 30px rgba(245, 197, 66, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
