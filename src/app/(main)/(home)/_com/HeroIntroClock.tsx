"use client";

import { resetHeroIntroClock } from "@/lib/heroIntro";
import { useLayoutEffect } from "react";

/** Clears any prior intro clock when navigating to home */
export default function HeroIntroClock() {
  useLayoutEffect(() => {
    resetHeroIntroClock();
  }, []);

  return null;
}
