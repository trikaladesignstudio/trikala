"use client";

import Navbar from "@/components/custom/NavBar";
import { HeroScrollContext } from "@/context/HeroScrollContext";
import { useScrollContainer } from "@/context/ScrollContainerContext";
import { useHeroIntroReveal } from "@/hooks/useHeroIntroReveal";
import {
  useHeroScrollTrigger,
  type HeroScrollTriggerTargets,
} from "@/hooks/useHeroScrollTrigger";
import { armHeroIntro, dispatchHeroIntroComplete } from "@/lib/heroIntro";
import {
  applyFrameWindow,
  CONTENT_STAGGER,
  FRAME_INSET_START,
  getPillInsets,
  lerpFrameInset,
  radiusForHeight,
  SSR_PILL_INSETS,
  SSR_VIEWPORT,
  pillWindowStyle,
  type PillInsets,
} from "@/lib/heroIntroFrame";
import { INTRO_REVEAL_MS } from "@/lib/heroIntro";
import { HERO_ELEMENT_VIEWPORTS } from "@/lib/heroScrollPhases";
import {
  getViewportHeight,
  getViewportWidth,
  VIEWPORT_HEIGHT_CHANGE_EVENT,
} from "@/lib/viewportHeight";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type FramedHeroShellProps = {
  background: ReactNode;
  headline?: ReactNode;
  className?: string;
};

const EDGE_MASK_SHADOW = "0 0 0 9999px #ffffff";
const INTRO_PILL_STYLE = pillWindowStyle(SSR_PILL_INSETS, SSR_VIEWPORT.height);

function staggerRange(range: readonly [number, number]) {
  return (intro: number) => {
    const [start, end] = range;
    if (intro <= start) return 0;
    if (intro >= end) return 1;
    return (intro - start) / (end - start);
  };
}

function staggerLift(range: readonly [number, number], px = 14) {
  return (intro: number) => {
    const [start, end] = range;
    if (intro <= start) return px;
    if (intro >= end) return 0;
    const t = (intro - start) / (end - start);
    return px * (1 - t);
  };
}

export default function FramedHeroShell({
  background,
  headline,
  className,
}: FramedHeroShellProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const edgeMaskRef = useRef<HTMLDivElement>(null);
  const contentClipRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const darkBleedRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useScrollContainer();
  const prefersReducedMotion = useReducedMotion();
  const [frameInsetStart, setFrameInsetStart] = useState(FRAME_INSET_START);
  const [pillInsets, setPillInsets] = useState<PillInsets>(SSR_PILL_INSETS);
  const [introComplete, setIntroComplete] = useState(false);
  const [introMounted, setIntroMounted] = useState(true);
  const viewportHeightRef = useRef(SSR_VIEWPORT.height);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    window.setTimeout(() => setIntroMounted(false), 300);
  }, []);

  const introReveal = useHeroIntroReveal({
    onComplete: handleIntroComplete,
    prefersReducedMotion,
  });

  useLayoutEffect(() => {
    armHeroIntro();
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      viewportHeightRef.current = getViewportHeight();
      setPillInsets(getPillInsets(getViewportHeight(), getViewportWidth()));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener(VIEWPORT_HEIGHT_CHANGE_EVENT, update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener(VIEWPORT_HEIGHT_CHANGE_EVENT, update);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = (m: MediaQueryList | MediaQueryListEvent) =>
      setFrameInsetStart(m.matches ? 6 : FRAME_INSET_START);
    apply(mq);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (introComplete) return;
    const fallback = window.setTimeout(() => {
      introReveal.set(1);
      setIntroComplete(true);
      setIntroMounted(false);
      dispatchHeroIntroComplete();
    }, INTRO_REVEAL_MS + 800);
    return () => window.clearTimeout(fallback);
  }, [introComplete, introReveal]);

  useEffect(() => {
    if (!introComplete) return;
    dispatchHeroIntroComplete();

    const container = scrollContainerRef?.current;
    if (!container) return;

    container.scrollTop = 0;
    requestAnimationFrame(() => {
      container.scrollTop = 0;
    });
  }, [introComplete, scrollContainerRef]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    if (!introMounted || introComplete) {
      container.style.overflowY = "";
      return;
    }

    container.style.overflowY = "hidden";
    return () => {
      container.style.overflowY = "";
    };
  }, [introMounted, introComplete, scrollContainerRef]);

  const applyIntroFrame = useCallback(
    (intro: number) => {
      const edgeMask = edgeMaskRef.current;
      const contentClip = contentClipRef.current;
      const bg = bgRef.current;
      if (!edgeMask || !contentClip) return;

      const insets = {
        top: lerpFrameInset(intro, pillInsets.top, frameInsetStart),
        left: lerpFrameInset(intro, pillInsets.left, frameInsetStart),
        right: lerpFrameInset(intro, pillInsets.right, frameInsetStart),
        bottom: lerpFrameInset(intro, pillInsets.bottom, frameInsetStart),
      };
      const borderRadius = radiusForHeight(
        viewportHeightRef.current - insets.top - insets.bottom
      );

      applyFrameWindow(edgeMask, insets, borderRadius);
      applyFrameWindow(contentClip, insets, borderRadius);
      if (bg) bg.style.opacity = "1";
    },
    [frameInsetStart, pillInsets]
  );

  const scrollTargets = useMemo<HeroScrollTriggerTargets>(
    () => ({
      hero: heroRef,
      edgeMask: edgeMaskRef,
      contentClip: contentClipRef,
      background: bgRef,
      scrim: scrimRef,
      nav: navRef,
      headline: headlineRef,
      darkBleed: darkBleedRef,
    }),
    []
  );

  useHeroScrollTrigger({
    scroller: scrollContainerRef ?? { current: null },
    targets: scrollTargets,
    frameInsetStart,
    introComplete,
    prefersReducedMotion,
  });

  useMotionValueEvent(introReveal, "change", (intro) => {
    if (introComplete) return;
    applyIntroFrame(intro);
  });

  useLayoutEffect(() => {
    const edgeMask = edgeMaskRef.current;
    const contentClip = contentClipRef.current;
    if (!edgeMask || !contentClip) return;

    if (introComplete) {
      const insets = {
        top: frameInsetStart,
        left: frameInsetStart,
        right: frameInsetStart,
        bottom: frameInsetStart,
      };
      const borderRadius = radiusForHeight(
        viewportHeightRef.current - insets.top - insets.bottom
      );
      applyFrameWindow(edgeMask, insets, borderRadius);
      applyFrameWindow(contentClip, { top: 0, left: 0, right: 0, bottom: 0 }, 0);
      if (bgRef.current) bgRef.current.style.opacity = "1";
      return;
    }

    applyIntroFrame(introReveal.get());
  }, [
    introComplete,
    introMounted,
    applyIntroFrame,
    introReveal,
    pillInsets,
    frameInsetStart,
  ]);

  const contextValue = useMemo(
    () => ({ introReveal, introComplete }),
    [introReveal, introComplete]
  );

  const navOpacity = useTransform(introReveal, staggerRange(CONTENT_STAGGER.nav));
  const navY = useTransform(introReveal, staggerLift(CONTENT_STAGGER.nav));

  const headlineWithRef =
    headline && isValidElement(headline)
      ? cloneElement(headline as ReactElement<{ ref?: React.Ref<HTMLDivElement> }>, {
          ref: headlineRef,
        })
      : headline;

  return (
    <HeroScrollContext.Provider value={contextValue}>
      <div
        ref={heroRef}
        className={cn(
          "hero-block relative w-full shrink-0 snap-start snap-always bg-[#1a1a1a]",
          className
        )}
        style={{
          height: `calc(var(--viewport-height) * ${HERO_ELEMENT_VIEWPORTS})`,
        }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={bgRef} className="absolute inset-0 opacity-0">
            {background}
            <div
              ref={scrimRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65"
            />
            <div
              ref={darkBleedRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[#1a1a1a] opacity-0"
            />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
          >
            <div
              ref={edgeMaskRef}
              className="absolute will-change-[top,left,right,bottom,border-radius]"
              style={{ boxShadow: EDGE_MASK_SHADOW, ...INTRO_PILL_STYLE }}
            />
          </div>

          <div
            ref={contentClipRef}
            className="absolute inset-0 z-[3] overflow-hidden will-change-[top,left,right,bottom,border-radius]"
            style={INTRO_PILL_STYLE}
          >
            <div
              className={cn(
                "relative z-30",
                "[--hero-header:6.5rem] lg:[--hero-header:8.25rem]",
                introComplete && "pt-[var(--frame-inset)]"
              )}
              style={
                { "--frame-inset": `${frameInsetStart}px` } as React.CSSProperties
              }
            >
              <motion.div
                ref={navRef}
                style={
                  introComplete
                    ? undefined
                    : { opacity: navOpacity, y: navY }
                }
                className={cn(
                  "lg:relative",
                  introComplete
                    ? "max-lg:absolute max-lg:inset-x-[var(--frame-inset)] max-lg:top-0"
                    : "max-lg:absolute max-lg:inset-x-0 max-lg:top-0"
                )}
              >
                <Navbar />
              </motion.div>
            </div>

            {headlineWithRef}
          </div>
        </div>
      </div>
    </HeroScrollContext.Provider>
  );
}
