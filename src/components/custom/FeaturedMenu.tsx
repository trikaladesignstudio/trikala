"use client";

import { type CSSProperties } from "react";
import InfiniteMenu, {
  type InfiniteMenuItem,
} from "@/components/custom/InfiniteMenu/InfiniteMenu";
import useScreenWidth from "@/hooks/ScreenResize";
import { useFeaturedGlobeIntro } from "@/hooks/useFeaturedGlobeIntro";
import {
  MOBILE_GLOBE_MAX_WIDTH,
  MOBILE_GLOBE_SCALE,
  REVEAL_DURATION_MS,
  REVEAL_STAGGER_MS,
} from "@/lib/featuredGlobeIntro";
import { cn } from "@/lib/utils";

const labelClassName =
  "featured-label globe-reveal-item globe-reveal-item--label pointer-events-none absolute left-0 top-0 z-[2] page-x pt-[max(0.75rem,2.5svh)] font-silver text-base uppercase tracking-[0.14em] text-white/80 transition-opacity duration-500 sm:pt-[max(1rem,3svh)] sm:text-lg lg:pt-10 lg:text-2xl";

type FeaturedMenuProps = {
  items: InfiniteMenuItem[];
  loading?: boolean;
};

export default function FeaturedMenu({ items, loading }: FeaturedMenuProps) {
  const { width } = useScreenWidth();
  const { introPrepareRequested, introRequested, introPlaying, introComplete, handleIntroComplete } =
    useFeaturedGlobeIntro();

  const globeScale =
    width > 0 && width < MOBILE_GLOBE_MAX_WIDTH ? MOBILE_GLOBE_SCALE : 1;

  return (
    <div
      className={cn(
        "relative h-full min-h-0 w-full flex-1",
        introComplete && "featured-globe-reveal"
      )}
      style={
        introComplete
          ? ({
              "--globe-reveal-duration": `${REVEAL_DURATION_MS}ms`,
              "--globe-reveal-label": `${REVEAL_STAGGER_MS.label}ms`,
              "--globe-reveal-title": `${REVEAL_STAGGER_MS.title}ms`,
              "--globe-reveal-description": `${REVEAL_STAGGER_MS.description}ms`,
              "--globe-reveal-button": `${REVEAL_STAGGER_MS.button}ms`,
              "--globe-reveal-hint": `${REVEAL_STAGGER_MS.hint}ms`,
            } as CSSProperties)
          : undefined
      }
    >
      <p className={cn(labelClassName, introPlaying && "opacity-0")}>
        Featured Work
      </p>
      <div className="absolute inset-0 min-h-0">
        {loading ? (
          <div
            className="absolute inset-0 animate-pulse bg-white/[0.04]"
            aria-hidden
          />
        ) : (
          <InfiniteMenu
            items={items}
            showOverlay
            scale={globeScale}
            introPrepareRequested={introPrepareRequested}
            introRequested={introRequested}
            introPlaying={introPlaying}
            introComplete={introComplete}
            onIntroComplete={handleIntroComplete}
          />
        )}
      </div>
    </div>
  );
}
