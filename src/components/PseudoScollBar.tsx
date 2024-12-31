"use client";

import {
  motion,
  useAnimation,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

const parentCointerId = "mainCointainer";

function PsudoScollBar() {
  const [mainParentScoll, setMainParentScoll] = useState<HTMLElement | null>(
    null
  );
  // Control animation using Framer Motion
  const controls = useAnimation();
  useEffect(() => {
    const parentScoll = document?.getElementById(
      parentCointerId
    ) as HTMLElement;

    if (parentScoll) {
      setMainParentScoll(parentScoll);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    container: {
      current: mainParentScoll,
    },
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const heightConverstion = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // spring
  const sheight = useSpring(heightConverstion, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.1,
  });

  useMotionValueEvent(sheight, "change", (latest) => {
    controls.start({ opacity: 1, top: `${100 * latest}%` });
    setTimeout(() => {
      controls.start({ opacity: 0 });
    }, 1000);
  });

  return (
    <motion.div
      id="scrollbar"
      animate={controls}
      className="bg-gray-500/70 fixed z-50 top-0 right-0 h-[4rem]  w-[0.4rem] rounded-full -translate-y-full"
      // style={{ height }}
    />
  );
}

export default PsudoScollBar;
