import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-950": "#063B2B",
        "green-900": "#075E45",
        "green-800": "#087F5B",
        "green-700": "#0A9B68",
        "green-600": "#22C55E",
        "green-400": "#4ADE9B",
        "green-100": "#DDF8EA",
        surface: "rgba(255,255,255,0.72)",
        "surface-strong": "rgba(255,255,255,0.88)",
        text: "#0B1F17",
        muted: "#4B6358",
        border: "rgba(10,155,104,0.18)",
        danger: "#C0392B",
        warning: "#A16207",
        glass: "rgba(255,255,255,0.55)",
      },
      borderRadius: {
        card: "20px",
        xl2: "28px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontVariantNumeric: {
        tabular: "tabular-nums",
      },
      backdropBlur: {
        xs: "2px",
        glass: "14px",
        strong: "24px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(10,155,104,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
        "glass-lg": "0 20px 60px rgba(10,155,104,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
        glow: "0 0 40px rgba(34,197,94,0.35)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(1200px 600px at 10% 10%, rgba(34,197,94,0.25), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(10,155,104,0.22), transparent 60%), radial-gradient(800px 500px at 50% 100%, rgba(74,222,155,0.18), transparent 60%)",
      },
      animation: {
        "blob-float": "blobFloat 18s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out both",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        blobFloat: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-40px) scale(1.08)" },
          "66%": { transform: "translate(-20px,30px) scale(0.95)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;