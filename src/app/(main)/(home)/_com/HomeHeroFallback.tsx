"use client";

import {
  applyFrameWindow,
  FRAME_INSET_START,
  getPillInsets,
  lerpFrameInset,
  pillWindowStyle,
  radiusForHeight,
  SSR_PILL_INSETS,
  SSR_VIEWPORT,
} from "@/lib/heroIntroFrame";
import { getHeroIntroProgress } from "@/lib/heroIntro";
import { useLayoutEffect, useRef } from "react";

const EDGE_MASK_SHADOW = "0 0 0 9999px #ffffff";
const INTRO_PILL_STYLE = pillWindowStyle(SSR_PILL_INSETS, SSR_VIEWPORT.height);

/** Suspense fallback — mirrors hero pill intro while hero data loads */
export default function HomeHeroFallback() {
  const edgeMaskRef = useRef<HTMLDivElement>(null);
  const contentClipRef = useRef<HTMLDivElement>(null);
  const viewportHeightRef = useRef(SSR_VIEWPORT.height);

  useLayoutEffect(() => {
    viewportHeightRef.current = window.innerHeight;
    const pillInsets = getPillInsets(window.innerHeight, window.innerWidth);
    const edgeMask = edgeMaskRef.current;
    const contentClip = contentClipRef.current;
    if (!edgeMask || !contentClip) return;

    let raf = 0;

    const tick = () => {
      const intro = getHeroIntroProgress();
      const insets = {
        top: lerpFrameInset(intro, pillInsets.top, FRAME_INSET_START),
        left: lerpFrameInset(intro, pillInsets.left, FRAME_INSET_START),
        right: lerpFrameInset(intro, pillInsets.right, FRAME_INSET_START),
        bottom: lerpFrameInset(intro, pillInsets.bottom, FRAME_INSET_START),
      };
      const borderRadius = radiusForHeight(
        viewportHeightRef.current - insets.top - insets.bottom
      );

      applyFrameWindow(edgeMask, insets, borderRadius);
      applyFrameWindow(contentClip, insets, borderRadius);

      if (intro < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative h-[100svh] w-full shrink-0 bg-[#1a1a1a]">
      <div className="fixed inset-0 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        >
          <div
            ref={edgeMaskRef}
            className="absolute will-change-[top,left,right,bottom,border-radius]"
            style={{ boxShadow: EDGE_MASK_SHADOW, ...INTRO_PILL_STYLE }}
          />
        </div>
        <div
          ref={contentClipRef}
          className="absolute inset-0 z-[3] overflow-hidden bg-[#1a1a1a] will-change-[top,left,right,bottom,border-radius]"
          style={INTRO_PILL_STYLE}
        />
      </div>
    </section>
  );
}
