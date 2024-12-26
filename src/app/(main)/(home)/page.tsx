"use cache";

// import Lead from "@/components/sections/custom/Lead";
import HeroTest from "@/components/sections/HeroTest";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import Expertise from "@/components/sections/ExpertiseTest";
import Featured from "@/components/sections/Feature";
import PriceEstimator from "@/components/sections/PriceEstimatorTest";
import Testimonials from "@/components/sections/Testimonials";
import Video from "@/components/sections/Video";
import Working from "@/components/sections/Working";

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
