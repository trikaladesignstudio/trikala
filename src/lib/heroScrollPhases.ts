/**
 * Extra hero height beyond one viewport — user scrolls this distance
 * while the sticky viewport animates frame bleed, headline exit, and dark handoff.
 */
export const HERO_APPROACH_VIEWPORTS = 0.45;

/** Hero block = one viewport + approach scroll room */
export const HERO_ELEMENT_VIEWPORTS = 1 + HERO_APPROACH_VIEWPORTS;

/** White edge bleed during approach scroll (first ~8% of approach) */
export const FRAME_BLEED_PORTION = 0.08;

/** Headline fade + drift window (late in approach scroll) */
export const HEADLINE_FADE_START = 0.90;
export const HEADLINE_FADE_END = 0.95;
export const HEADLINE_TRAVEL_PX = 80;

/** Charcoal overlay ramps in at the very end of approach scroll */
export const DARK_BLEED_START = 0.95;
export const DARK_BLEED_END = 1;

export function segmentProgress(
  progress: number,
  start: number,
  end: number
): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}
