"use client";

import HeroFeaturedMenu from "@/components/custom/HeroFeaturedMenu";
import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { useScrollContainer } from "@/context/ScrollContainerContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect, useState } from "react";

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

/** Client content — mounts WebGL menu only when section nears viewport */
export function FeaturedSectionContent({ items }: FeaturedSectionContentProps) {
  const scrollContainer = useScrollContainer();
  const [mountMenu, setMountMenu] = useState(false);

  useEffect(() => {
    const section = document.getElementById("featured-work");
    if (!section) return;

    const root = scrollContainer?.current ?? null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMountMenu(true);
          observer.disconnect();
        }
      },
      { root, rootMargin: "20% 0px 0px 0px", threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [scrollContainer]);

  useEffect(() => {
    if (!mountMenu) return;

    const container = scrollContainer?.current;
    const scrollTop = container?.scrollTop ?? 0;
    ScrollTrigger.refresh();
    if (container) container.scrollTop = scrollTop;
  }, [mountMenu, scrollContainer]);

  if (!mountMenu) return null;
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
