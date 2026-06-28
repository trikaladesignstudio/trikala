"use client";

import InfiniteMenu, {
  type InfiniteMenuItem,
} from "@/components/custom/InfiniteMenu/InfiniteMenu";

type HeroFeaturedMenuProps = {
  items: InfiniteMenuItem[];
};

export default function HeroFeaturedMenu({ items }: HeroFeaturedMenuProps) {
  return (
    <div className="relative h-full w-full">
      <p className="pointer-events-none absolute left-0 top-0 z-[1] page-x pt-28 font-silver text-lg uppercase tracking-[0.14em] text-white/80 md:text-2xl lg:pt-10">
        Featured Work
      </p>
      <InfiniteMenu items={items} scale={1} showOverlay />
    </div>
  );
}
