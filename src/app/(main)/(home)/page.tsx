import { Suspense } from "react";
import HomeClientShell from "./_com/HomeClientShell";
import { FeaturedSectionShell } from "@/components/sections/FeaturedSection";
import { buildPageMetadata, SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";
import FasterHome from "./_com/FastestHero";
import FeaturedHome from "./_com/FeaturedHome";
import FeaturedSectionFallback from "./_com/FeaturedSectionFallback";
import HomeHeroFallback from "./_com/HomeHeroFallback";
import OtherHomeConponent from "./_com/OtherHomeConponent";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description:
    "Trikal Architects — eco-friendly architecture and interior design studio serving Delhi NCR. Residential, commercial, and landscape projects.",
  path: "/",
});

export default function Home() {
  return (
    <HomeClientShell>
      <Suspense fallback={<HomeHeroFallback />}>
        <FasterHome />
      </Suspense>
      <FeaturedSectionShell>
        <Suspense fallback={<FeaturedSectionFallback />}>
          <FeaturedHome />
        </Suspense>
      </FeaturedSectionShell>
      <Suspense fallback={null}>
        <OtherHomeConponent />
      </Suspense>
    </HomeClientShell>
  );
}
