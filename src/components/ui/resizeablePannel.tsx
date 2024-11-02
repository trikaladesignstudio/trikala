"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useId } from "react";
import { useMeasure } from "react-use";

const duration = 5;

export function ResizablePanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [ref, { height }] = useMeasure();
  const id = useId();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      transition={{ height: { duration, delay: duration } }}
      className={cn("relative ", className)}
      //   className="relative overflow-hidden"
    >
      <motion.div
        key={id}
        // key={JSON.stringify(children, ignoreCircularReferences())}
        animate={{
          opacity: 1,
          transition: { duration: duration / 2, delay: duration / 2 },
        }}
        exit={{
          y: -10,
          opacity: 0,
          transition: { duration: duration / 2 },
        }}
      >
        <div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          className={`${height ? "absolute" : "relative"} w-full`}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
