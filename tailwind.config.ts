import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(90deg, #ffffffE6, transparent 20%, transparent 80%, #ffffffE6)",
        "fade-gradient":
          "linear-gradient(90deg, transparent, transparent 20%, transparent 60%, #0000004D)",
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
      colors: {
        "custom-premium": "#D1C1A4",
        "custom-db": "#170800",
        "custom-lb": "#774931",
        "custom-bg": "#DEDEDE",
        black: "#1A1A1A",
      },
      fontFamily: {
        silver: ["var(--font-silver)"],
      },
    },
  },
  safelist: ["lg:[--divider:4]", "md:[--divider:10]", "sm:[--divider:10]"],
  plugins: [],
};
export default config;
