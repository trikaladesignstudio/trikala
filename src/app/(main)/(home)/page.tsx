"use cache";

// import Lead from "@/components/sections/custom/Lead";
import HeroTest from "@/components/sections/HeroTest";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Expertise = dynamic(() => import("@/components/sections/ExpertiseTest"), {
  ssr: true,
  suspense: true,
});

const Featured = dynamic(() => import("@/components/sections/Feature"), {
  ssr: true,
  suspense: true,
});

const PriceEstimator = dynamic(
  () => import("@/components/sections/PriceEstimatorTest"),
  {
    ssr: true,
    suspense: true,
  }
);

const Testimonials = dynamic(
  () => import("@/components/sections/Testimonials"),
  {
    ssr: true,
    suspense: true,
  }
);

const Video = dynamic(() => import("@/components/sections/Video"), {
  ssr: true,
  suspense: true,
});

const Working = dynamic(() => import("@/components/sections/Working"), {
  ssr: true,
  suspense: true,
});

export const revalidate = 300;

export default async function Home() {
  const heroData = filterAllProjects(sectionType.hero);
  const [workingData, testimonialData] = await Promise.all([
    filterAllProjects(sectionType.working),
    filterAllProjects(sectionType.testimonials),
  ]);

  return (
    <>
      <Suspense>
        <HeroTest pData={heroData} />
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
