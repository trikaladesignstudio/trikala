import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(90deg, #ffffffE6, transparent 20%, transparent 80%, #ffffffE6)",
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
      keyframes: {
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
      },
      fontFamily: {
        custom: ["Silver Queen", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
