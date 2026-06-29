import { INTRO_REVEAL_MS } from "./heroIntro";

export const FRAME_INSET_START = 14;
export const FRAME_RADIUS_START = 22;
export const INTRO_HOLD_END = 0.04;
export const PILL_EXPAND_MS = 600;

/** Pill expansion ends after hold + PILL_EXPAND_MS on the master intro clock */
export const FRAME_EXPAND_END =
  INTRO_HOLD_END + PILL_EXPAND_MS / INTRO_REVEAL_MS;

export const PILL_HEIGHT = 12;
export const PILL_WIDTH = 48;

/** ease-out bezier for pill → hero expansion */
export const EXPAND_EASE = [0.16, 1, 0.3, 1] as const;

const NAV_REVEAL = 0.1;
const HEADLINE_REVEAL = 0.09;

/** Nav + headline chain immediately after pill expansion */
export const CONTENT_STAGGER = {
  nav: [FRAME_EXPAND_END, FRAME_EXPAND_END + NAV_REVEAL] as const,
  headline: [
    FRAME_EXPAND_END + NAV_REVEAL,
    FRAME_EXPAND_END + NAV_REVEAL + HEADLINE_REVEAL,
  ] as const,
} as const;

export type PillInsets = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export function getPillInsets(h: number, w: number): PillInsets {
  return {
    top: h / 2 - PILL_HEIGHT / 2,
    left: w / 2 - PILL_WIDTH / 2,
    right: w / 2 - PILL_WIDTH / 2,
    bottom: h / 2 - PILL_HEIGHT / 2,
  };
}

/** Stable defaults so SSR and first client paint match */
export const SSR_VIEWPORT = { width: 1920, height: 1080 };
export const SSR_PILL_INSETS = getPillInsets(
  SSR_VIEWPORT.height,
  SSR_VIEWPORT.width
);

function cubicBezierEase(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      const slope = sampleDX(t);
      if (Math.abs(dx) < 1e-7 || slope < 1e-5) break;
      t -= dx / slope;
    }

    return sampleY(t);
  };
}

const easeExpand = cubicBezierEase(...EXPAND_EASE);

export function expansionProgress(intro: number) {
  if (intro <= INTRO_HOLD_END) return 0;
  const raw = Math.min(
    (intro - INTRO_HOLD_END) / (FRAME_EXPAND_END - INTRO_HOLD_END),
    1
  );
  return easeExpand(raw);
}

export function lerpFrameInset(intro: number, pill: number, target: number) {
  return pill + (target - pill) * expansionProgress(intro);
}

export function radiusForHeight(height: number) {
  return Math.min(Math.max(height * 0.5, 2), FRAME_RADIUS_START);
}

export function applyFrameWindow(
  el: HTMLElement,
  insets: PillInsets,
  borderRadius: number
) {
  el.style.top = `${insets.top}px`;
  el.style.left = `${insets.left}px`;
  el.style.right = `${insets.right}px`;
  el.style.bottom = `${insets.bottom}px`;
  el.style.borderRadius = `${borderRadius}px`;
}

export function pillWindowStyle(insets: PillInsets, viewportHeight: number) {
  const height = viewportHeight - insets.top - insets.bottom;
  return {
    top: `${insets.top}px`,
    left: `${insets.left}px`,
    right: `${insets.right}px`,
    bottom: `${insets.bottom}px`,
    borderRadius: `${radiusForHeight(height)}px`,
  };
}
