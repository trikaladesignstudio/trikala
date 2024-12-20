// import Lead from "@/components/custom/Lead";
import Expertise from "@/components/ExpertiseTest";
import Featured from "@/components/Feature";
// import PriceEstimator from "@/components/PriceEstimator";
import Testimonials from "@/components/Testimonials";
import Working from "@/components/Working";
import HeroTest from "@/components/HeroTest";
import { filterAllProjects, getAllFeaturedProjects } from "@/utils/dbActions";
import { sectionType } from "@/utils/client_utils";
import { Suspense } from "react";
import Lead from "@/components/custom/Lead";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
// import Interior from "@/components/Interior";
// import SectionGrid from "@/components/custom/SectionGrid";
// import Hero from "@/components/Hero";
const Video = dynamic(() => import("@/components/Video"), { ssr: true });

export default async function Home() {
  const heroData = await filterAllProjects(sectionType.hero);
  const workingData = await filterAllProjects(sectionType.working);
  const testimonialData = await filterAllProjects(sectionType.testimonials);
  const featuresData = await getAllFeaturedProjects();
  const footerData = await filterAllProjects(sectionType.contact);

  return (
    <Suspense>
      <HeroTest data={heroData} />
      <Suspense>
        <Lead />
        <Featured data={featuresData} />
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
