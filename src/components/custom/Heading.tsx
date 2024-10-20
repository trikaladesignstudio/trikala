"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

type Heading = {
  className?: string;
  children: ReactNode;
};
function Heading({ className, children }: Heading) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "text-4xl md:text-6xl lg:text-7xl tracking-tight font-custom",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default Heading;
