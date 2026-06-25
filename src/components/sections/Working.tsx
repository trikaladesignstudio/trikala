"use client";

import { cn, rollInView } from "@/lib/utils";
import { filterAllProjects } from "@/utils/dbActions";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Heading from "../custom/Heading";
import Sections from "../custom/Section";

const panelSpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.75,
};

const contentSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 28,
};

type Slide = Awaited<ReturnType<typeof filterAllProjects>>[number] & {
  stepNumber: string;
};

function formatSlides(
  data: Awaited<ReturnType<typeof filterAllProjects>>
): Slide[] {
  return [...data]
    .sort((a, b) => {
      const numA = parseInt(a.title.match(/^\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.title.match(/^\d+/)?.[0] || "0", 10);
      return numA - numB;
    })
    .map((item, index) => ({
      ...item,
      stepNumber: String(index + 1).padStart(2, "0"),
      title: item.title.replace(/^\d+\.\s*/, ""),
    }));
}

const PANEL_ANIMATION_MS = 300;

function Working({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const slides = useMemo(() => formatSlides(data), [data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExpandedDescription, setShowExpandedDescription] = useState(true);
  const hasMountedRef = useRef(false);

  const activeSlide = slides[currentIndex];

  const selectStep = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setShowExpandedDescription(false);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setShowExpandedDescription(false);
    const timer = window.setTimeout(() => {
      setShowExpandedDescription(true);
    }, PANEL_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        selectStep(Math.min(index + 1, slides.length - 1));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        selectStep(Math.max(index - 1, 0));
      }
    },
    [selectStep, slides.length]
  );

  if (slides.length === 0) {
    return (
      <Sections className="lg:py-0 justify-center lg:gap-10">
        <Heading text="Our work is based on the development of an individual approach to each client" />
      </Sections>
    );
  }

  return (
    <Sections className="lg:py-0 justify-center lg:gap-10">
      <Heading text="Our work is based on the development of an individual approach to each client" />

      {/* Mobile: hero image + step list */}
      <motion.div
        variants={rollInView}
        viewport={{ once: true }}
        initial="base"
        whileInView="show"
        transition={{ ...rollInView.transition, delay: 0.2 }}
        className="md:hidden flex flex-col gap-6 w-full"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={panelSpring}
              className="absolute inset-0"
            >
              <Image
                loading="lazy"
                src={activeSlide.images?.[0]?.url ?? "/static/logo.webp"}
                alt={`${activeSlide.title}, step ${activeSlide.stepNumber} of our design process`}
                className="h-full w-full object-cover"
                fill
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-zinc-950/35" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          role="tablist"
          aria-label="Design process steps"
          className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                id={`working-tab-${slide.id}`}
                aria-selected={isActive}
                aria-controls={`working-panel-${slide.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectStep(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "grid grid-cols-[2.5rem_1fr] gap-x-3 items-baseline py-4 text-left transition-colors duration-300 w-full",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
                  isActive ? "text-white" : "text-white/60 hover:text-white/80"
                )}
              >
                <span
                  className={cn(
                    "tabular-nums shrink-0 leading-none transition-all duration-300 text-right",
                    isActive
                      ? "text-sm text-white/70"
                      : "text-xl font-bold text-white/45"
                  )}
                >
                  {slide.stepNumber}
                </span>
                <span
                  className={cn(
                    "text-[1.2rem] leading-snug",
                    isActive ? "font-bold" : "font-semibold"
                  )}
                >
                  {slide.title}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {showExpandedDescription && (
            <motion.div
              key={activeSlide.id}
              id={`working-panel-${activeSlide.id}`}
              role="tabpanel"
              aria-labelledby={`working-tab-${activeSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={contentSpring}
            >
              <p className="text-sm px-2 text-justify leading-4">
                {activeSlide.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Desktop: horizontal accordion */}
      <motion.div
        variants={rollInView}
        viewport={{ once: true }}
        initial="base"
        whileInView="show"
        transition={{ ...rollInView.transition, delay: 0.25 }}
        className="hidden md:block w-full"
      >
        <LayoutGroup id="working-accordion">
          <div
            role="tablist"
            aria-label="Design process steps"
            className="flex w-full h-[55vh] gap-1 overflow-hidden"
          >
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <motion.div
                  key={slide.id}
                  role="tab"
                  id={`working-tab-${slide.id}`}
                  aria-selected={isActive}
                  aria-controls={`working-panel-${slide.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectStep(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  animate={{ flex: isActive ? 5 : 1 }}
                  transition={panelSpring}
                  whileTap={{ scale: 0.995 }}
                  className={cn(
                    "relative h-full min-w-0 cursor-pointer overflow-hidden border border-white/10",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  )}
                >
                  <div className="absolute inset-0">
                    <Image
                      loading="lazy"
                      src={slide.images?.[0]?.url ?? "/static/logo.webp"}
                      alt={`${slide.title}, step ${slide.stepNumber} of our design process`}
                      className="h-full w-full object-cover"
                      fill
                      sizes={isActive ? "60vw" : "8vw"}
                    />
                  </div>
                  <div className="absolute inset-0 bg-zinc-950/35" />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/20 to-transparent",
                      "text-white z-10 pointer-events-none flex flex-col justify-end p-4",
                      isActive ? "items-stretch" : "items-center"
                    )}
                  >
                    {!isActive ? (
                      <div className="flex flex-col items-center justify-end w-full h-full pb-1">
                        <span className="tabular-nums text-2xl lg:text-3xl font-bold leading-none text-white shrink-0">
                          {slide.stepNumber}
                        </span>
                      </div>
                    ) : (
                      <motion.div
                        layout
                        id={`working-panel-${slide.id}`}
                        role="tabpanel"
                        aria-labelledby={`working-tab-${slide.id}`}
                        transition={panelSpring}
                        className="w-full px-2 pb-2 text-left flex flex-col gap-1"
                      >
                        <motion.span
                          layout="position"
                          transition={panelSpring}
                          className="text-sm tabular-nums text-white/70 leading-none"
                        >
                          {slide.stepNumber}
                        </motion.span>
                        <motion.h3
                          layout="position"
                          transition={panelSpring}
                          className="font-bold text-[1.2rem] lg:text-[1.8rem] leading-tight"
                        >
                          {slide.title}
                        </motion.h3>
                        <AnimatePresence initial={false}>
                          {showExpandedDescription && (
                            <motion.div
                              key={`desc-${slide.id}-${currentIndex}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={contentSpring}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-justify leading-4 pt-1">
                                {slide.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </motion.div>
    </Sections>
  );
}

export default Working;
