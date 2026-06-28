"use client";
import { brurRenderVariant, cn, transition } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

type Heading = {
  className?: string;
  text: string;
  customDelay?: number;
  playOnMount?: boolean;
  speed?: "normal" | "fast";
};

function Heading({
  className,
  text,
  customDelay = 0,
  playOnMount = false,
  speed = "normal",
}: Heading) {
  const words = text.split(" ");
  const wordStagger = speed === "fast" ? 0.1 : 0.2;
  const wordDuration = speed === "fast" ? 0.45 : transition.duration;

  return (
    <motion.h1
      className={cn(
        "text-4xl md:text-5xl lg:text-7xl tracking-tight font-silver",
        className
      )}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <motion.span
            className="inline-block"
            viewport={{ once: true }}
            transition={{
              ...transition,
              duration: wordDuration,
              delay: customDelay + index * wordStagger,
            }}
            variants={brurRenderVariant}
            initial="hidden"
            animate={playOnMount ? "visible" : "hidden"}
            whileInView={playOnMount ? undefined : "visible"}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </motion.h1>
  );
}

export default Heading;
