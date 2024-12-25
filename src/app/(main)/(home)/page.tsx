"use cache";

// import Lead from "@/components/sections/custom/Lead";
import Expertise from "@/components/sections/ExpertiseTest";
import Featured from "@/components/sections/Feature";
import HeroTest from "@/components/sections/HeroTest";
import PriceEstimator from "@/components/sections/PriceEstimatorTest";
import Testimonials from "@/components/sections/Testimonials";
import Working from "@/components/sections/Working";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Video = dynamic(() => import("@/components/sections/Video"), {
  ssr: true,
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
