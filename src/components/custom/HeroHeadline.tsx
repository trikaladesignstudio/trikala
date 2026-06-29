"use client";

import Heading from "@/components/custom/Heading";
import { useHeroScroll } from "@/context/HeroScrollContext";
import { CONTENT_STAGGER } from "@/lib/heroIntroFrame";
import {
  motion,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import { forwardRef } from "react";

type HeroHeadlineProps = {
  text: string;
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function headlineReveal(intro: number, start: number, end: number) {
  if (intro <= start) return 0;
  if (intro >= end) return 1;
  return easeOutCubic((intro - start) / (end - start));
}

const HeroHeadline = forwardRef<HTMLDivElement, HeroHeadlineProps>(
  function HeroHeadline({ text }, ref) {
    const { introReveal, introComplete } = useHeroScroll();
    const [start, end] = CONTENT_STAGGER.headline;

    const introOpacity = useTransform(introReveal, (intro) =>
      headlineReveal(intro, start, end)
    );
    const introBlur = useTransform(introReveal, (intro) => {
      const progress = headlineReveal(intro, start, end);
      return 16 * (1 - progress);
    });
    const introFilter = useMotionTemplate`blur(${introBlur}px)`;

    return (
      <div
        ref={ref}
        className="pointer-events-none absolute left-1/2 top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 will-change-[opacity,filter]"
      >
        <motion.div
          style={
            introComplete
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: introOpacity, filter: introFilter }
          }
        >
          <Heading
            playOnMount={false}
            startVisible
            text={text}
            className="text-center text-[4rem] font-bold leading-[0.9] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)] md:text-[6rem] lg:text-[8rem]"
          />
        </motion.div>
      </div>
    );
  }
);

export default HeroHeadline;
