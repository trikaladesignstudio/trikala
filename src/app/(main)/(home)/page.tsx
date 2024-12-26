"use cache";

// import Lead from "@/components/sections/custom/Lead";
import HeroTest from "@/components/sections/HeroTest";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Expertise = dynamic(() => import("@/components/sections/ExpertiseTest"), {
  ssr: false,
  suspense: true,
});

const Featured = dynamic(() => import("@/components/sections/Feature"), {
  ssr: false,
  suspense: true,
});

const PriceEstimator = dynamic(
  () => import("@/components/sections/PriceEstimatorTest"),
  {
    ssr: false,
    suspense: true,
  }
);

const Testimonials = dynamic(
  () => import("@/components/sections/Testimonials"),
  {
    ssr: false,
    suspense: true,
  }
);

const Video = dynamic(() => import("@/components/sections/Video"), {
  ssr: false,
  suspense: true,
});

const Working = dynamic(() => import("@/components/sections/Working"), {
  ssr: false,
  suspense: true,
});

export const revalidate = 60 * 60 * 0.5;

export default async function Home() {
  const heroData = await filterAllProjects(sectionType.hero);
  const workingData = await filterAllProjects(sectionType.working);
  const testimonialData = await filterAllProjects(sectionType.testimonials);

  return (
    <>
      <Suspense>
        <HeroTest data={heroData} />
      </Suspense>
      <Suspense>
        <Featured />
        <Expertise />
        <Working data={workingData} />
        <Testimonials data={testimonialData} />
        <PriceEstimator />
        <Video />
      </Suspense>
    </>
  );
}
