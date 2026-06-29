"use client";

import { HERO_INTRO_COMPLETE_EVENT } from "@/lib/heroIntro";
import { ReactNode, useEffect, useState } from "react";

import { INTRO_REVEAL_MS } from "@/lib/heroIntro";

/** Matches intro duration + buffer */
const DEFAULT_FALLBACK_MS = INTRO_REVEAL_MS + 800;

type LazyMountProps = {
  children: ReactNode;
  /** Wait for hero intro before mounting children (home page) */
  waitForHeroIntro?: boolean;
  fallbackMs?: number;
};

export default function LazyMount({
  children,
  waitForHeroIntro = true,
  fallbackMs = DEFAULT_FALLBACK_MS,
}: LazyMountProps) {
  const [mounted, setMounted] = useState(!waitForHeroIntro);

  useEffect(() => {
    if (!waitForHeroIntro || mounted) return;

    const mount = () => setMounted(true);
    window.addEventListener(HERO_INTRO_COMPLETE_EVENT, mount, { once: true });
    const timer = window.setTimeout(mount, fallbackMs);

    return () => {
      window.removeEventListener(HERO_INTRO_COMPLETE_EVENT, mount);
      window.clearTimeout(timer);
    };
  }, [waitForHeroIntro, mounted, fallbackMs]);

  if (!mounted) return null;
  return children;
}
