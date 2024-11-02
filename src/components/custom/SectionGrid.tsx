import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type SectionGridType = {
  className?: string;
  children: ReactNode;
};

function SectionGrid({ className, children }: SectionGridType) {
  return (
    <section
      className={cn(
        "min-h-screen px-[2rem] lg:px-[5rem] py-12 grid",
        "snap-center snap-always shrink-0",
        className
      )}
    >
      {children}
    </section>
  );
}

export default SectionGrid;
