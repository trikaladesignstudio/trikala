"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

type Section = {
  className?: string;
  children: ReactNode;
  toSnap?: boolean;
};

function Section({ className, children, toSnap = true }: Section) {
  const ref = useRef(null);
  const isInView = useInView(ref);

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
        "relative min-h-screen flex flex-col gap-4 justify-evenly",
        "px-[2rem] lg:px-[5rem] py-12 lg:py-10",
        toSnap && "snap-center shrink-0",
        className
      )}
      ref={ref}
    >
      <motion.div
        style={{
          // transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0.8,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 2s",
        }}
        initial={{
          opacity: 1,
          filter: "blur(10px)",
          // backgroundColor: "black",
        }}
        animate={{
          opacity: 0,
          filter: "blur(0px)",
          // backgroundColor: "black",
        }}
        exit={{
          opacity: 1,
          filter: "blur(10px)",
          // backgroundColor: "black",
        }}
        transition={{
          duration: 0.5,
          delay: 0.3,
        }}
        className="absolute top-0 left-0 bg-black w-full h-full  z-10 pointer-events-none"
      />
      {children}
    </motion.section>
  );
}

export default Section;
