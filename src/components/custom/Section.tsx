"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

type Section = {
  className?: string;
  children: ReactNode;
};

function Section({ className, children }: Section) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "min-h-screen px-[2rem] lg:px-[5rem] py-12 lg:py-20 flex flex-col ",
        "snap-center snap-always shrink-0",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

export default Section;
