"use client";

import dynamic from "next/dynamic";
import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { featuredSectionLabelClassName } from "@/lib/featuredSectionStyles";

const InfiniteMenu = dynamic(
  () => import("@/components/custom/InfiniteMenu/InfiniteMenu"),
  { ssr: false, loading: () => null }
);

type HeroFeaturedMenuProps = {
  items: InfiniteMenuItem[];
};

export default function HeroFeaturedMenu({ items }: HeroFeaturedMenuProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden lg:block">
      <p className={featuredSectionLabelClassName}>Featured Work</p>
      <div className="relative min-h-0 flex-1">
        <InfiniteMenu items={items} scale={1} showOverlay />
      </div>
    </div>
  );
}
