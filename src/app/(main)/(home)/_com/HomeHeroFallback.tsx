"use client";

import {
  pillWindowStyle,
  SSR_PILL_INSETS,
  SSR_VIEWPORT,
} from "@/lib/heroIntroFrame";

const EDGE_MASK_SHADOW = "0 0 0 9999px #ffffff";
const INTRO_PILL_STYLE = pillWindowStyle(SSR_PILL_INSETS, SSR_VIEWPORT.height);

/** Suspense fallback — static centered pill while hero data loads */
export default function HomeHeroFallback() {
  return (
    <section className="relative h-screen w-full shrink-0 bg-[#1a1a1a]">
      <div className="fixed inset-0 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        >
          <div
            className="absolute will-change-[top,left,right,bottom,border-radius]"
            style={{ boxShadow: EDGE_MASK_SHADOW, ...INTRO_PILL_STYLE }}
          />
        </div>
        <div
          className="absolute inset-0 z-[3] overflow-hidden bg-[#1a1a1a] will-change-[top,left,right,bottom,border-radius]"
          style={INTRO_PILL_STYLE}
        />
      </div>
    </section>
  );
}
