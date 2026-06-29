/** Extra scroll room while sticky hero pins the viewport */
export const HERO_APPROACH_VIEWPORTS = 0.35;

/** Hero block = one viewport + approach scroll */
export const HERO_ELEMENT_VIEWPORTS = 1 + HERO_APPROACH_VIEWPORTS;

/** White edge bleed — first 8% of approach scroll */
export const FRAME_BLEED_PORTION = 0.08;

/** Headline hold — 20% window after bleed, text fully visible */
export const HEADLINE_HOLD_START = FRAME_BLEED_PORTION;
export const HEADLINE_HOLD_END = HEADLINE_HOLD_START + 0.2;

/** Headline exits during the remaining approach scroll */
export const HEADLINE_EXIT_END = 1;
export const HEADLINE_SCALE_PEAK = 1.28;
export const HEADLINE_SCALE_EXIT = 1.45;

export function segmentProgress(
  progress: number,
  start: number,
  end: number
): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}
