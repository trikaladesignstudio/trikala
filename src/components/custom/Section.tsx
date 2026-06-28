"use client";
import { cn } from "@/lib/utils";
import { motion, useAnimate, useInView } from "framer-motion";
import { ReactNode, useEffect } from "react";

// need to add this
//motion.dev/docs/react-use-animate#scroll-triggered-animations

type Section = {
  id?: string;
  className?: string;
  children: ReactNode;
  toSnap?: boolean;
  style?: React.CSSProperties;
};

function Section({ id, className, children, toSnap = true, style }: Section) {
  const [ref, animate] = useAnimate();
  const isInView = useInView(ref);

  useEffect(() => {
    (async () => {
      if (isInView) {
        await animate(ref.current, { filter: "blur(0)", opacity: 1 }, {});
        // await animate(".animateup", { opacity: 1, x: 0 });
      }
    })();
  }, [isInView, animate, ref]);

  return (
    <motion.section
      id={id}
      transition={{
        // duration: 0.2,
        delay: 0.02,
        // type: "spring",
        // staggerChildren: 0.2,
        // when: "beforeChildren", //use this instead of delay
      }}
      initial={{
        opacity: 0,
        filter: "blur(5px)",
      }}
      className={cn(
        "relative min-h-[100svh] w-screen flex flex-col gap-4 justify-evenly",
        "page-px py-6 lg:py-10 ",
        toSnap && "snap-center shrink-0",
        className
      )}
      style={style}
      ref={ref}
    >
      {children}
    </motion.section>
  );
}

export default Section;
