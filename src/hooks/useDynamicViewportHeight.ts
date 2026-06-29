"use client";

import { VIEWPORT_HEIGHT_CHANGE_EVENT } from "@/lib/viewportHeight";
import { useEffect } from "react";

function getVisibleHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function useDynamicViewportHeight() {
  useEffect(() => {
    let rafId = 0;
    let lastHeight = 0;

    const syncViewportHeight = () => {
      const height = getVisibleHeight();
      if (height === lastHeight) return;

      lastHeight = height;
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${height}px`
      );
      window.dispatchEvent(new Event(VIEWPORT_HEIGHT_CHANGE_EVENT));
    };

    const scheduleSync = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncViewportHeight);
    };

    scheduleSync();

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", scheduleSync);
    visualViewport?.addEventListener("scroll", scheduleSync);
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", scheduleSync);

    return () => {
      cancelAnimationFrame(rafId);
      visualViewport?.removeEventListener("resize", scheduleSync);
      visualViewport?.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", scheduleSync);
    };
  }, []);
}
