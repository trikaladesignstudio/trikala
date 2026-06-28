"use client";

import { ensureHeroIntroStarted, resetHeroIntroClock } from "@/lib/heroIntro";
import { useLayoutEffect } from "react";

/** Clears any prior intro clock when navigating to home */
export default function HeroIntroClock() {
  useLayoutEffect(() => {
    resetHeroIntroClock();
    ensureHeroIntroStarted();
  }, []);

  return null;
}
