"use client";

import { useScrollContainer } from "@/context/ScrollContainerContext";
import {
  FEATURED_SECTION_ID,
  INTRO_PREPARE_THRESHOLD,
  INTRO_SPIN_THRESHOLD,
} from "@/lib/featuredGlobeIntro";
import { useCallback, useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useFeaturedGlobeIntro() {
  const scrollContainer = useScrollContainer();
  const introPlayedRef = useRef(false);
  const [introPrepareRequested, setIntroPrepareRequested] = useState(false);
  const [introRequested, setIntroRequested] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroPlaying(false);
    setIntroComplete(true);
  }, []);

  useEffect(() => {
    const root = scrollContainer?.current;
    if (!root || introPlayedRef.current) return;

    const section = document.getElementById(FEATURED_SECTION_ID);
    if (!section) return;

    const onPrepare = () => {
      if (introPlayedRef.current) return;
      if (prefersReducedMotion()) {
        introPlayedRef.current = true;
        setIntroComplete(true);
        return;
      }
      setIntroPrepareRequested(true);
      setIntroPlaying(true);
    };

    const onSpin = () => {
      if (introPlayedRef.current) return;
      introPlayedRef.current = true;
      prepareObserver.disconnect();
      spinObserver.disconnect();

      if (prefersReducedMotion()) {
        setIntroComplete(true);
        return;
      }

      setIntroRequested(true);
      setIntroPlaying(true);
    };

    const prepareObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onPrepare();
      },
      { root, threshold: INTRO_PREPARE_THRESHOLD }
    );

    const spinObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onSpin();
      },
      { root, threshold: INTRO_SPIN_THRESHOLD }
    );

    prepareObserver.observe(section);
    spinObserver.observe(section);

    return () => {
      prepareObserver.disconnect();
      spinObserver.disconnect();
    };
  }, [scrollContainer]);

  return {
    introPrepareRequested,
    introRequested,
    introPlaying,
    introComplete,
    handleIntroComplete,
  };
}
