export const HERO_INTRO_COMPLETE_EVENT = "hero-intro-complete";
export const HERO_INTRO_START_EVENT = "hero-intro-start";

export const INTRO_REVEAL_MS = 2600;
/** Safety fallback if hero image never loads */
export const INTRO_IMAGE_TIMEOUT_MS = 4000;
/** Linear master clock — easing lives on expansion + stagger phases */
export const INTRO_EASE = [0, 0, 1, 1] as const;

let startedAt: number | null = null;
let introArmed = false;
let imageReady = false;
let imageLoadReported = false;
let imageTimeoutId: number | null = null;
let introCompleted = false;

function clearImageTimeout() {
  if (imageTimeoutId !== null) {
    clearTimeout(imageTimeoutId);
    imageTimeoutId = null;
  }
}

function dispatchHeroIntroStart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HERO_INTRO_START_EVENT));
}

function startHeroIntroClock() {
  if (startedAt !== null || typeof performance === "undefined") return;

  clearImageTimeout();
  startedAt = performance.now();
  dispatchHeroIntroStart();
}

function maybeStartHeroIntro() {
  if (startedAt !== null || introCompleted) return;
  if (!introArmed || !imageReady) return;
  startHeroIntroClock();
}

function scheduleImageTimeout() {
  if (imageTimeoutId !== null || typeof window === "undefined") return;

  imageTimeoutId = window.setTimeout(() => {
    imageTimeoutId = null;
    if (!imageReady) {
      imageReady = true;
      maybeStartHeroIntro();
    }
  }, INTRO_IMAGE_TIMEOUT_MS);
}

export function dispatchHeroIntroComplete() {
  if (typeof window === "undefined") return;
  introCompleted = true;
  window.dispatchEvent(new CustomEvent(HERO_INTRO_COMPLETE_EVENT));
}

export function resetHeroIntroClock() {
  clearImageTimeout();
  startedAt = null;
  introArmed = false;
  imageReady = false;
  imageLoadReported = false;
  introCompleted = false;
}

export function armHeroIntro() {
  introArmed = true;
  if (imageLoadReported) {
    imageReady = true;
    clearImageTimeout();
  }
  scheduleImageTimeout();
  maybeStartHeroIntro();
}

export function signalHeroImageReady() {
  imageLoadReported = true;
  if (imageReady) return;
  imageReady = true;
  clearImageTimeout();
  maybeStartHeroIntro();
}

export function isHeroIntroStarted() {
  return startedAt !== null;
}

/** @deprecated Use armHeroIntro + signalHeroImageReady instead */
export function ensureHeroIntroStarted() {
  startHeroIntroClock();
}

export function getHeroIntroProgress() {
  if (startedAt === null) return 0;
  return Math.min(1, (performance.now() - startedAt) / INTRO_REVEAL_MS);
}

export function getHeroIntroRemainingMs() {
  if (startedAt === null) return INTRO_REVEAL_MS;
  const elapsed = performance.now() - startedAt;
  return Math.max(0, INTRO_REVEAL_MS - elapsed);
}

export function isHeroIntroFinished() {
  return introCompleted || getHeroIntroProgress() >= 1;
}
