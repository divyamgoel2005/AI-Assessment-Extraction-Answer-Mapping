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
        veda: {
          orange: "#F05A28",
          orangeLight: "#FFF1EB",
          orangeBorder: "#FDD8C8",
          orangeHover: "#DE4B1B",
          dark: "#1A1A1A",
          sidebar: "#FFFFFF",
          bg: "#F7F8FA",
          card: "#FFFFFF",
          border: "#E9ECEF",
          muted: "#717680",
          green: "#16A34A",
          greenLight: "#DCFCE7",
          greenBg: "rgba(34, 197, 94, 0.12)",
          greenBorder: "#22C55E",
          red: "#DC2626",
          redLight: "#FEE2E2",
          yellow: "#D97706",
          yellowLight: "#FEF3C7",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        highlight: "0 0 0 2px #F05A28",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.8" },
        },
        twinkle: {
          "0%, 100%": { transform: "scale(0.8)", opacity: "0.4" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        twinkle: "twinkle 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
