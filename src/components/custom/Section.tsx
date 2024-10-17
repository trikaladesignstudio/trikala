import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Section = {
  className?: string;
  children: ReactNode;
};

function Section({ className, children }: Section) {
  return (
    <section
      className={cn(
        "min-h-screen px-[2rem] lg:px-[5rem] py-12 lg:py-20 flex flex-col ",
        "snap-center snap-always shrink-0",
        className
      )}
    >
      {children}
    </section>
  );
}

export default Section;
