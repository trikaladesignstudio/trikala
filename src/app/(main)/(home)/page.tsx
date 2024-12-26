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
