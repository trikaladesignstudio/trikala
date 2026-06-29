"use client";

import InfiniteMenu, {
  type InfiniteMenuItem,
} from "@/components/custom/InfiniteMenu/InfiniteMenu";

const labelClassName =
  "pointer-events-none shrink-0 page-x pt-24 pb-3 font-silver text-lg uppercase tracking-[0.14em] text-white/80 sm:pt-28 sm:pb-4 lg:absolute lg:left-0 lg:top-0 lg:z-[1] lg:pb-0 lg:pt-10 md:text-2xl";

type FeaturedMenuProps = {
  items: InfiniteMenuItem[];
  loading?: boolean;
};

export default function FeaturedMenu({ items, loading }: FeaturedMenuProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <p className={labelClassName}>Featured Work</p>
      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div
            className="absolute inset-0 animate-pulse bg-white/[0.04]"
            aria-hidden
          />
        ) : (
          <InfiniteMenu items={items} showOverlay />
        )}
      </div>
    </div>
  );
}
