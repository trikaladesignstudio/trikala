"use client";

import {
  ensureHeroIntroStarted,
  getHeroIntroProgress,
  INTRO_EASE,
  INTRO_REVEAL_MS,
  isHeroIntroFinished,
} from "@/lib/heroIntro";
import { animate, useMotionValue } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

type UseHeroIntroRevealOptions = {
  onComplete?: () => void;
};

export function useHeroIntroReveal({ onComplete }: UseHeroIntroRevealOptions = {}) {
  const introReveal = useMotionValue(0);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    if (isHeroIntroFinished()) {
      introReveal.set(1);
      onCompleteRef.current?.();
      return;
    }

    ensureHeroIntroStarted();
    const startProgress = getHeroIntroProgress();
    introReveal.set(startProgress);

    const controls = animate(introReveal, 1, {
      duration: (INTRO_REVEAL_MS * (1 - startProgress)) / 1000,
      ease: [...INTRO_EASE],
      onComplete: () => {
        onCompleteRef.current?.();
      },
    });

    return () => controls.stop();
  }, [introReveal]);

  return introReveal;
}

export { INTRO_REVEAL_MS, isHeroIntroFinished };
