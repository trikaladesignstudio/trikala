export const HERO_INTRO_COMPLETE_EVENT = "hero-intro-complete";

export const INTRO_REVEAL_MS = 1700;
/** Linear master clock — easing lives on expansion + stagger phases */
export const INTRO_EASE = [0, 0, 1, 1] as const;

let startedAt: number | null = null;

export function dispatchHeroIntroComplete() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HERO_INTRO_COMPLETE_EVENT));
}

export function resetHeroIntroClock() {
  startedAt = null;
}

export function ensureHeroIntroStarted() {
  if (startedAt === null && typeof performance !== "undefined") {
    startedAt = performance.now();
  }
}

export function getHeroIntroProgress() {
  if (startedAt === null) return 0;
  return Math.min(1, (performance.now() - startedAt) / INTRO_REVEAL_MS);
}

export function getHeroIntroRemainingMs() {
  ensureHeroIntroStarted();
  const elapsed = startedAt ? performance.now() - startedAt : 0;
  return Math.max(0, INTRO_REVEAL_MS - elapsed);
}

export function isHeroIntroFinished() {
  return getHeroIntroProgress() >= 1;
}
