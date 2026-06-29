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

const HeroHeadline = forwardRef<HTMLDivElement, HeroHeadlineProps>(
  function HeroHeadline({ text }, ref) {
    const { introReveal, introComplete } = useHeroScroll();
    const [start, end] = CONTENT_STAGGER.headline;

    const introOpacity = useTransform(introReveal, [start, end], [0, 1]);
    const introBlur = useTransform(introReveal, [start, end], [14, 0]);
    const introFilter = useMotionTemplate`blur(${introBlur}px)`;

    return (
      <div
        ref={ref}
        className="pointer-events-none absolute left-1/2 top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 will-change-[opacity,filter]"
      >
        <motion.div
          style={
            introComplete
              ? undefined
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
