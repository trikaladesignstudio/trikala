"use client";

import Heading from "@/components/custom/Heading";
import { useHeroScroll } from "@/context/HeroScrollContext";
import { CONTENT_STAGGER } from "@/lib/heroIntroFrame";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { forwardRef, useState } from "react";

type HeroHeadlineProps = {
  text: string;
};

const HeroHeadline = forwardRef<HTMLDivElement, HeroHeadlineProps>(
  function HeroHeadline({ text }, ref) {
    const { introReveal } = useHeroScroll();
    const [playTitle, setPlayTitle] = useState(false);
    const [start, end] = CONTENT_STAGGER.headline;

    useMotionValueEvent(introReveal, "change", (value) => {
      if (value > start) setPlayTitle(true);
    });

    const introOpacity = useTransform(introReveal, [start, end], [0, 1]);
    const introY = useTransform(introReveal, [start, end], [16, 0]);

    return (
      <div
        ref={ref}
        className="pointer-events-none absolute left-1/2 top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <motion.div style={{ opacity: introOpacity, y: introY }}>
          <Heading
            playOnMount={playTitle}
            speed="fast"
            customDelay={0.04}
            text={text}
            className="text-center text-[4rem] font-bold leading-[0.9] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)] md:text-[6rem] lg:text-[8rem]"
          />
        </motion.div>
      </div>
    );
  }
);

export default HeroHeadline;
