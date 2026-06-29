"use client";

import { ScrollContainerContext } from "@/context/ScrollContainerContext";
import {
  HERO_INTRO_COMPLETE_EVENT,
  isHeroIntroFinished,
} from "@/lib/heroIntro";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

function pinScrollTop(container: HTMLElement) {
  container.scrollTop = 0;
  requestAnimationFrame(() => {
    container.scrollTop = 0;
  });
}

export default function MainScrollContainer({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrollRef = useRef<HTMLElement>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);

  useEffect(() => {
    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isHome) return;

    pinScrollTop(container);
  }, [isHome, pathname]);

  useEffect(() => {
    if (!isHome) {
      setSnapEnabled(false);
      return;
    }

    const container = scrollRef.current;
    if (!container) return;

    const onIntroComplete = () => {
      pinScrollTop(container);
      setSnapEnabled(true);
    };

    if (isHeroIntroFinished()) onIntroComplete();
    window.addEventListener(HERO_INTRO_COMPLETE_EVENT, onIntroComplete, {
      once: true,
    });

    return () => {
      window.removeEventListener(HERO_INTRO_COMPLETE_EVENT, onIntroComplete);
    };
  }, [isHome]);

  return (
    <ScrollContainerContext.Provider value={scrollRef}>
      <main
        ref={scrollRef}
        id="mainCointainer"
        className={cn(
          "relative flex flex-col overflow-x-hidden",
          isHome
            ? cn(
                "h-[100svh] overflow-y-auto overflow-x-hidden",
                snapEnabled ? "snap-y snap-mandatory" : "snap-none"
              )
            : "min-h-[100svh] overflow-y-visible scroll-smooth"
        )}
      >
        {children}
      </main>
    </ScrollContainerContext.Provider>
  );
}
