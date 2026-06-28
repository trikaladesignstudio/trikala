import LazyMount from "@/components/custom/LazyMount";
import { FeaturedSectionShell } from "@/components/sections/FeaturedSection";
import { Suspense } from "react";
import FasterHome from "./_com/FastestHero";
import FeaturedHome from "./_com/FeaturedHome";
import HeroIntroClock from "./_com/HeroIntroClock";
import HomeClickSpark from "./_com/HomeClickSpark";
import HomeHeroFallback from "./_com/HomeHeroFallback";
import OtherHomeConponent from "./_com/OtherHomeConponent";

export const revalidate = 300;

export default function Home() {
  return (
    <HomeClickSpark>
      <HeroIntroClock />
      <Suspense fallback={<HomeHeroFallback />}>
        <FasterHome />
      </Suspense>
      <FeaturedSectionShell>
        <LazyMount>
          <Suspense fallback={null}>
            <FeaturedHome />
          </Suspense>
        </LazyMount>
      </FeaturedSectionShell>
      <LazyMount>
        <Suspense fallback={null}>
          <OtherHomeConponent />
        </Suspense>
      </LazyMount>
    </HomeClickSpark>
  );
}
