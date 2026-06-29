import { ReactNode } from "react";

const SECTION_CLASS =
  "relative flex h-[100svh] min-h-[100svh] w-full shrink-0 flex-col overflow-hidden bg-[#1a1a1a] snap-center snap-always";

export function FeaturedSectionShell({ children }: { children?: ReactNode }) {
  return (
    <section id="featured-work" className={SECTION_CLASS}>
      {children}
    </section>
  );
}
