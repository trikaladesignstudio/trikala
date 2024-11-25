"use client";
import { brurRenderVariant, cn, transition } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

type Heading = {
  className?: string;
  text: string;
};

function Heading({ className, text }: Heading) {
  const words = text.split(" ");

  return (
    <motion.div
      className={cn(
        "text-4xl md:text-5xl lg:text-7xl tracking-tight font-silver",
        className
      )}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <motion.span
            className="inline-block"
            transition={transition}
            variants={brurRenderVariant}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && " "}
        </React.Fragment>
      ))}
      {/* //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   exit={{ opacity: 0 }}
    //   className={cn( 
    //     "text-4xl md:text-5xl lg:text-7xl tracking-tight font-silver",
    //     className
    //   )}
    // >
    */}
    </motion.div>
  );
}

export default Heading;
