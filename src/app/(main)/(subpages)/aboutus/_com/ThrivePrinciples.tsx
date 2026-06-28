"use client";

import Heading from "@/components/custom/Heading";
import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { principles } from "./principles";

const panelSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
};

function ActiveLetterPulse({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <motion.span
      className="absolute inset-0 rounded-md bg-custom-lb/20"
      animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.04, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function ThrivePrinciples() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePrinciple = principles[activeIndex];

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex(Math.min(index + 1, principles.length - 1));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(Math.max(index - 1, 0));
      }
    },
    []
  );

  return (
    <section className="w-full bg-[#f5f5f5]">
      <div className="page-x py-10 lg:py-16">
        <div className="mb-8 flex flex-col gap-3 lg:mb-12">
          <Heading text="THRIVE" className="text-left text-zinc-900" />
          <p className="max-w-[65ch] text-left text-sm text-zinc-600 md:text-base">
            Our guiding principles
          </p>
          <div className="h-px w-12 bg-custom-lb" />
        </div>

        <LayoutGroup id="thrive-principles">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
            <div
              role="tablist"
              aria-label="THRIVE guiding principles"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
            >
              {principles.map((principle, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={principle.letter}
                    type="button"
                    role="tab"
                    id={`thrive-tab-${principle.letter}`}
                    aria-selected={isActive}
                    aria-controls={`thrive-panel-${principle.letter}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className={cn(
                      "relative shrink-0 rounded-md px-4 py-3 text-left transition-colors duration-200",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-lb/50",
                      "min-h-[44px] min-w-[44px] lg:w-full lg:min-w-0",
                      isActive
                        ? "bg-custom-lb text-white"
                        : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                    )}
                  >
                    <ActiveLetterPulse isActive={isActive} />
                    <span className="relative z-10 flex items-center gap-3">
                      <span
                        className={cn(
                          "font-silver text-xl leading-none lg:text-2xl",
                          isActive ? "text-white" : "text-zinc-400"
                        )}
                      >
                        {principle.letter}
                      </span>
                      <span
                        className={cn(
                          "hidden text-sm leading-snug lg:inline",
                          isActive ? "font-semibold text-white" : "font-medium"
                        )}
                      >
                        {principle.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id={`thrive-panel-${activePrinciple.letter}`}
              role="tabpanel"
              aria-labelledby={`thrive-tab-${activePrinciple.letter}`}
              className="border-l border-zinc-200 pl-0 lg:border-l-2 lg:border-custom-lb/30 lg:pl-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activePrinciple.letter}
                  layoutId="thrive-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={panelSpring}
                  className="flex flex-col gap-4"
                >
                  <span className="font-silver text-5xl leading-none text-custom-lb/30 lg:text-6xl">
                    {activePrinciple.letter}
                  </span>
                  <h2 className="text-xl font-bold text-zinc-900 md:text-2xl lg:text-3xl">
                    {activePrinciple.title}
                  </h2>
                  <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-600 md:text-base lg:text-lg">
                    {activePrinciple.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
