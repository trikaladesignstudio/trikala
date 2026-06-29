"use client";

import dynamic from "next/dynamic";
import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { featuredSectionLabelClassName } from "@/lib/featuredSectionStyles";
import { motion } from "framer-motion";

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
      <motion.p
        className={featuredSectionLabelClassName}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      >
        Featured Work
      </motion.p>
      <motion.div
        className="relative min-h-0 flex-1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <InfiniteMenu items={items} scale={1} showOverlay />
      </motion.div>
    </div>
  );
}
