"use client";

import HeroFeaturedMenu from "@/components/custom/HeroFeaturedMenu";
import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { useScrollContainer } from "@/context/ScrollContainerContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect } from "react";

const SECTION_BASE =
  "relative h-[100svh] min-h-[100svh] w-full shrink-0 overflow-hidden bg-[#1a1a1a]";

type FeaturedSectionShellProps = {
  children?: ReactNode;
};

/** Always mounted on home — reserves scroll height; snap handled by scroll container */
export function FeaturedSectionShell({ children }: FeaturedSectionShellProps) {
  return (
    <section
      id="featured-work"
      className={`${SECTION_BASE} snap-center snap-always`}
    >
      {children}
    </section>
  );
}

type FeaturedSectionContentProps = {
  items: InfiniteMenuItem[];
};

/** Client content — mounts WebGL menu as soon as items are available */
export function FeaturedSectionContent({ items }: FeaturedSectionContentProps) {
  const scrollContainer = useScrollContainer();

  useEffect(() => {
    void import("@/components/custom/InfiniteMenu/InfiniteMenu");
  }, []);

  useEffect(() => {
    const container = scrollContainer?.current;
    const scrollTop = container?.scrollTop ?? 0;
    ScrollTrigger.refresh();
    if (container) container.scrollTop = scrollTop;
  }, [scrollContainer, items]);

  return <HeroFeaturedMenu items={items} />;
}

type FeaturedSectionProps = {
  items: InfiniteMenuItem[];
};

export default function FeaturedSection({ items }: FeaturedSectionProps) {
  return (
    <FeaturedSectionShell>
      <FeaturedSectionContent items={items} />
    </FeaturedSectionShell>
  );
}
