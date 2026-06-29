"use client";

import {
  getHeroIntroProgress,
  HERO_INTRO_START_EVENT,
  INTRO_EASE,
  INTRO_REVEAL_MS,
  isHeroIntroFinished,
  isHeroIntroStarted,
} from "@/lib/heroIntro";
import { animate, useMotionValue } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

type UseHeroIntroRevealOptions = {
  onComplete?: () => void;
  prefersReducedMotion?: boolean | null;
};

export function useHeroIntroReveal({
  onComplete,
  prefersReducedMotion = false,
}: UseHeroIntroRevealOptions = {}) {
  const introReveal = useMotionValue(0);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      introReveal.set(1);
      onCompleteRef.current?.();
      return;
    }

    if (isHeroIntroFinished()) {
      introReveal.set(1);
      onCompleteRef.current?.();
      return;
    }

    let controls: ReturnType<typeof animate> | undefined;

    const runAnimation = () => {
      const startProgress = getHeroIntroProgress();
      introReveal.set(startProgress);

      controls = animate(introReveal, 1, {
        duration: (INTRO_REVEAL_MS * (1 - startProgress)) / 1000,
        ease: [...INTRO_EASE],
        onComplete: () => {
          onCompleteRef.current?.();
        },
      });
    };

    if (isHeroIntroStarted()) {
      runAnimation();
      return () => controls?.stop();
    }

    const onStart = () => {
      if (isHeroIntroFinished()) {
        introReveal.set(1);
        onCompleteRef.current?.();
        return;
      }
      runAnimation();
    };

    window.addEventListener(HERO_INTRO_START_EVENT, onStart, { once: true });

    return () => {
      window.removeEventListener(HERO_INTRO_START_EVENT, onStart);
      controls?.stop();
    };
  }, [introReveal, prefersReducedMotion]);

  return introReveal;
}

export { INTRO_REVEAL_MS, isHeroIntroFinished };
