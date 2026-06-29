"use client";

import { HERO_INTRO_COMPLETE_EVENT } from "@/lib/heroIntro";
import { FRAME_RADIUS_START } from "@/lib/heroIntroFrame";
import {
  FRAME_BLEED_PORTION,
  HEADLINE_EXIT_END,
  HEADLINE_HOLD_END,
  HEADLINE_HOLD_START,
  HEADLINE_SCALE_EXIT,
  HEADLINE_SCALE_PEAK,
  HERO_APPROACH_VIEWPORTS,
  segmentProgress,
} from "@/lib/heroScrollPhases";
import {
  getViewportHeight,
  VIEWPORT_HEIGHT_CHANGE_EVENT,
} from "@/lib/viewportHeight";
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
      nodes.headline
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

      const { hero, edgeMask, contentClip, bg, scrim, nav, headline } =
        nodes as Required<ReturnType<typeof collectTargets>>;

      const insetStart = frameWindowFrom(frameInsetStart, frameInsetStart);
      const approachPx = HERO_APPROACH_VIEWPORTS * getViewportHeight();

      gsap.set(edgeMask, insetStart);
      gsap.set(contentClip, frameWindowTo);
      gsap.set(bg, { opacity: 1, scale: 1, transformOrigin: "center center" });
      gsap.set(scrim, { opacity: 1 });
      gsap.set(nav, { clearProps: "opacity,transform" });
      gsap.set(headline, {
        y: 0,
        opacity: 1,
        scale: 1,
        visibility: "visible",
        transformOrigin: "center center",
      });

      lastProgressRef.current = -1;

      const scrub = prefersReducedMotion ? false : 0.2;

      const approachTrigger = ScrollTrigger.create({
        trigger: hero,
        scroller: scrollerEl,
        start: "top top",
        end: `+=${approachPx}`,
        scrub,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.set(edgeMask, frameHidden);
          gsap.set(headline, { opacity: 0, visibility: "hidden" });
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

          if (progress < HEADLINE_HOLD_START) {
            gsap.set(headline, {
              y: 0,
              opacity: 1,
              scale: 1,
              visibility: "visible",
            });
          } else if (progress < HEADLINE_HOLD_END) {
            const holdT = segmentProgress(
              progress,
              HEADLINE_HOLD_START,
              HEADLINE_HOLD_END
            );
            gsap.set(headline, {
              y: 0,
              opacity: 1,
              scale: 1 + holdT * (HEADLINE_SCALE_PEAK - 1),
              visibility: "visible",
            });
          } else {
            const exitT = segmentProgress(
              progress,
              HEADLINE_HOLD_END,
              HEADLINE_EXIT_END
            );
            gsap.set(headline, {
              y: 0,
              opacity: Math.max(0, 1 - exitT),
              scale:
                HEADLINE_SCALE_PEAK +
                exitT * (HEADLINE_SCALE_EXIT - HEADLINE_SCALE_PEAK),
              visibility: exitT >= 1 ? "hidden" : "visible",
            });
          }
        },
      });

      const refresh = () => ScrollTrigger.refresh();

      refresh();
      window.addEventListener("resize", refresh);
      window.addEventListener(VIEWPORT_HEIGHT_CHANGE_EVENT, refresh);
      window.addEventListener(HERO_INTRO_COMPLETE_EVENT, refresh);

      cleanup = () => {
        window.removeEventListener("resize", refresh);
        window.removeEventListener(VIEWPORT_HEIGHT_CHANGE_EVENT, refresh);
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
