"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-3W6HG8151V";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", GA_MEASUREMENT_ID, { page_path: pagePath });
  }, [pathname, searchParams]);

  return null;
}
