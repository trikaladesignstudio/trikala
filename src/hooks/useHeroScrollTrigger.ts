"use client";

import { HERO_INTRO_COMPLETE_EVENT } from "@/lib/heroIntro";
import { FRAME_RADIUS_START } from "@/lib/heroIntroFrame";
import {
  DARK_BLEED_END,
  DARK_BLEED_START,
  FRAME_BLEED_PORTION,
  HEADLINE_FADE_END,
  HEADLINE_FADE_START,
  HEADLINE_TRAVEL_PX,
  HERO_APPROACH_VIEWPORTS,
  segmentProgress,
} from "@/lib/heroScrollPhases";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export type HeroScrollTriggerTargets = {
  hero: RefObject<HTMLElement | null>;
  edgeMask: RefObject<HTMLElement | null>;
  contentClip: RefObject<HTMLElement | null>;
  background: RefObject<HTMLElement | null>;
  scrim: RefObject<HTMLElement | null>;
  nav: RefObject<HTMLElement | null>;
  headline: RefObject<HTMLElement | null>;
  darkBleed: RefObject<HTMLElement | null>;
};

type UseHeroScrollTriggerOptions = {
  scroller: RefObject<HTMLElement | null>;
  targets: HeroScrollTriggerTargets;
  frameInsetStart: number;
  introComplete: boolean;
  prefersReducedMotion: boolean | null;
  onApproachProgress?: (progress: number) => void;
};

function collectTargets(targets: HeroScrollTriggerTargets) {
  return {
    hero: targets.hero.current,
    edgeMask: targets.edgeMask.current,
    contentClip: targets.contentClip.current,
    bg: targets.background.current,
    scrim: targets.scrim.current,
    nav: targets.nav.current,
    headline: targets.headline.current,
    darkBleed: targets.darkBleed.current,
  };
}

function targetsReady(
  scrollerEl: HTMLElement | null,
  nodes: ReturnType<typeof collectTargets>
) {
  return Boolean(
    scrollerEl &&
      nodes.hero &&
      nodes.edgeMask &&
      nodes.contentClip &&
      nodes.bg &&
      nodes.scrim &&
      nodes.nav &&
      nodes.headline &&
      nodes.darkBleed
  );
}

const frameWindowFrom = (inset: number, insetStart: number) => {
  const t = insetStart > 0 ? inset / insetStart : 0;
  return {
    top: inset,
    left: inset,
    right: inset,
    bottom: inset,
    borderRadius: t * FRAME_RADIUS_START,
    opacity: inset <= 0 ? 0 : 1,
  };
};

const frameHidden = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 0,
  opacity: 0,
};

const frameWindowTo = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 0,
};

export function useHeroScrollTrigger({
  scroller,
  targets,
  frameInsetStart,
  introComplete,
  prefersReducedMotion,
  onApproachProgress,
}: UseHeroScrollTriggerOptions) {
  const onApproachRef = useRef(onApproachProgress);
  onApproachRef.current = onApproachProgress;
  const lastProgressRef = useRef(-1);

  const emitProgress = (progress: number) => {
    if (Math.abs(progress - lastProgressRef.current) >= 0.008) {
      lastProgressRef.current = progress;
      onApproachRef.current?.(progress);
    }
  };

  useLayoutEffect(() => {
    if (!introComplete) return;

    let cancelled = false;
    let retryId = 0;
    let cleanup: (() => void) | undefined;

    const setup = () => {
      if (cancelled) return;

      const scrollerEl = scroller.current;
      const nodes = collectTargets(targets);

      if (!targetsReady(scrollerEl, nodes)) {
        retryId = window.requestAnimationFrame(setup);
        return;
      }

      const {
        hero,
        edgeMask,
        contentClip,
        bg,
        scrim,
        nav,
        headline,
        darkBleed,
      } = nodes as Required<ReturnType<typeof collectTargets>>;

      const insetStart = frameWindowFrom(frameInsetStart, frameInsetStart);
      const approachPx = HERO_APPROACH_VIEWPORTS * window.innerHeight;

      gsap.set(edgeMask, insetStart);
      gsap.set(contentClip, frameWindowTo);
      gsap.set(bg, { opacity: 1, scale: 1, transformOrigin: "center center" });
      gsap.set(scrim, { opacity: 1 });
      gsap.set(nav, { clearProps: "opacity,transform" });
      gsap.set(headline, { y: 0, opacity: 1, visibility: "visible" });
      gsap.set(darkBleed, { opacity: 0 });

      lastProgressRef.current = -1;

      const scrub = prefersReducedMotion ? false : 0.35;

      const approachTrigger = ScrollTrigger.create({
        trigger: hero,
        scroller: scrollerEl,
        start: "top top",
        end: `+=${approachPx}`,
        scrub,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.set(edgeMask, frameHidden);
          gsap.set(darkBleed, { opacity: 1 });
          gsap.set(bg, { opacity: 0 });
        },
        onUpdate(self) {
          const progress = self.progress;
          emitProgress(progress);

          const bleedT = Math.min(1, progress / FRAME_BLEED_PORTION);
          const inset = frameInsetStart * (1 - bleedT);

          if (bleedT >= 1) {
            gsap.set(edgeMask, frameHidden);
            gsap.set(contentClip, frameWindowTo);
          } else {
            gsap.set(edgeMask, frameWindowFrom(inset, frameInsetStart));
            gsap.set(contentClip, frameWindowTo);
          }

          const headlineT = segmentProgress(
            progress,
            HEADLINE_FADE_START,
            HEADLINE_FADE_END
          );
          gsap.set(headline, {
            y: -headlineT * HEADLINE_TRAVEL_PX,
            opacity: Math.max(0, 1 - headlineT * 1.15),
            visibility: headlineT >= 1 ? "hidden" : "visible",
          });

          const darkT = segmentProgress(
            progress,
            DARK_BLEED_START,
            DARK_BLEED_END
          );
          gsap.set(darkBleed, { opacity: darkT });
          gsap.set(bg, { opacity: 1 - darkT * 0.85 });
        },
      });

      const refresh = () => ScrollTrigger.refresh();

      refresh();
      window.addEventListener("resize", refresh);
      window.addEventListener(HERO_INTRO_COMPLETE_EVENT, refresh);

      cleanup = () => {
        window.removeEventListener("resize", refresh);
        window.removeEventListener(HERO_INTRO_COMPLETE_EVENT, refresh);
        approachTrigger.kill();
      };
    };

    setup();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(retryId);
      cleanup?.();
    };
  }, [scroller, targets, frameInsetStart, introComplete, prefersReducedMotion]);
}
