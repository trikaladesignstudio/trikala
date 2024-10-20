"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

type Section = {
  className?: string;
  children: ReactNode;
  toSnap?: boolean;
};

function Section({ className, children, toSnap = true }: Section) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "min-h-screen px-[2rem] lg:px-[5rem] py-12 lg:py-20 flex flex-col ",
        toSnap && "snap-center shrink-0",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

export default Section;
