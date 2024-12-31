"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

type SectionGridType = {
  className?: string;
  children: ReactNode;
  toSnap?: boolean;
};

function SectionGrid({ className, children, toSnap }: SectionGridType) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        delay: 0.5,
        ease: "easeIn",
        type: "spring",
        staggerChildren: 0.2,
        when: "beforeChildren", //use this instead of delay
      }}
      variants={{
        visible: {
          opacity: 1,
        },
        hidden: {
          opacity: 0,
        },
      }}
      className={cn(
        "min-h-[100svh] grid",
        "px-[2rem] lg:px-[5rem] py-6 lg:py-10",
        toSnap && "snap-center shrink-0",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

export default SectionGrid;
