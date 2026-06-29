import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = withUt({
  darkMode: "class",
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
        admin: {
          canvas: "var(--admin-canvas)",
          surface: "var(--admin-surface)",
          ink: "var(--admin-ink)",
          muted: "var(--admin-muted)",
          accent: "var(--admin-accent)",
          border: "var(--admin-border)",
        },
      },
      fontFamily: {
        silver: ["var(--font-silver)"],
        geist: ["var(--font-geist-sans)"],
        "geist-mono": ["var(--font-geist-mono)"],
      },
      height: {
        screen: "var(--viewport-height)",
        "viewport-unit": "calc(var(--viewport-height) / 100)",
      },
      minHeight: {
        screen: "var(--viewport-height)",
      },
    },
  },
  safelist: ["lg:[--divider:4]", "md:[--divider:10]", "sm:[--divider:10]"],
  plugins: [],
});
export default config;
