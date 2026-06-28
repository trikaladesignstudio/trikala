"use client";

import { createContext, useContext } from "react";
import { motionValue, type MotionValue } from "framer-motion";

type HeroScrollContextValue = {
  introReveal: MotionValue<number>;
};

export const HeroScrollContext = createContext<HeroScrollContextValue | null>(
  null
);

const FALLBACK_REVEAL = motionValue(1);

export function useHeroScroll(): HeroScrollContextValue {
  return (
    useContext(HeroScrollContext) ?? {
      introReveal: FALLBACK_REVEAL,
    }
  );
}
