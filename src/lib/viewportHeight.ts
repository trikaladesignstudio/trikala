import { SSR_VIEWPORT } from "@/lib/heroIntroFrame";

export const VIEWPORT_HEIGHT_CHANGE_EVENT = "viewport-height-change";

export function getViewportHeight() {
  if (typeof window === "undefined") return SSR_VIEWPORT.height;
  return window.visualViewport?.height ?? window.innerHeight;
}

export function getViewportWidth() {
  if (typeof window === "undefined") return SSR_VIEWPORT.width;
  return window.visualViewport?.width ?? window.innerWidth;
}
