import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        gold: {
          300: "#fcd47a",
          400: "#f5c842",
          500: "#e6b520",
          600: "#c49a10",
        },
        emerald: {
          950: "#022c22",
        },
        ink: {
          900: "#0a0f0d",
          800: "#111a16",
          700: "#1a2820",
        },
      },
      animation: {
        "liquid-slow": "liquid 8s ease-in-out infinite",
        "liquid-med": "liquid 6s ease-in-out infinite 1s",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        liquid: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", transform: "rotate(0deg) scale(1)" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", transform: "rotate(5deg) scale(1.05)" },
          "50%": { borderRadius: "50% 60% 30% 60% / 40% 30% 60% 50%", transform: "rotate(-3deg) scale(0.98)" },
          "75%": { borderRadius: "40% 50% 60% 30% / 70% 40% 50% 60%", transform: "rotate(2deg) scale(1.02)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 200, 66, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 200, 66, 0.6), 0 0 80px rgba(245, 200, 66, 0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
