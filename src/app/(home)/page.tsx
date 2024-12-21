// import Lead from "@/components/custom/Lead";
import Lead from "@/components/custom/Lead";
import Expertise from "@/components/ExpertiseTest";
import Featured from "@/components/Feature";
import Footer from "@/components/Footer";
import HeroTest from "@/components/HeroTest";
import PriceEstimator from "@/components/PriceEstimatorTest";
import Testimonials from "@/components/Testimonials";
import Working from "@/components/Working";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// import Interior from "@/components/Interior";
// import SectionGrid from "@/components/custom/SectionGrid";
// import Hero from "@/components/Hero";
const Video = dynamic(() => import("@/components/Video"), { ssr: true });

export const revalidate = 60 * 60 * 0.5;

export default async function Home() {
  const heroData = await filterAllProjects(sectionType.hero);
  const workingData = await filterAllProjects(sectionType.working);
  const testimonialData = await filterAllProjects(sectionType.testimonials);
  const footerData = await filterAllProjects(sectionType.contact);

  return (
    <Suspense>
      <HeroTest data={heroData} />
      <Suspense>
        <Lead />
        <Featured />
        <Expertise />
        <Working data={workingData} />
        <PriceEstimator />
        {/* <Interior /> */}
        <Testimonials data={testimonialData} />
        <Video />
        <Footer data={footerData} />
      </Suspense>
    </Suspense>
  );
}
