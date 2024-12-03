// import Lead from "@/components/custom/Lead";
import Expertise from "@/components/ExpertiseTest";
import Featured from "@/components/Feature";
import Footer from "@/components/Footer";
// import Interior from "@/components/Interior";
// import SectionGrid from "@/components/custom/SectionGrid";
// import Hero from "@/components/Hero";
import PriceEstimator from "@/components/PriceEstimator";
import Testimonials from "@/components/Testimonials";
import Working from "@/components/Working";
import Video from "@/components/Video";
import HeroTest from "@/components/HeroTest";
import { filterAllProjects } from "@/utils/dbActions";
import { sectionType } from "@/utils/client_utils";

export default async function Home() {
  const heroData = await filterAllProjects(sectionType.hero);
  return (
    <>
      <main className="relative flex flex-col snap-y snap-mandatory h-screen overflow-x-hidden scroll-smooth overflow-y-scroll">
        <HeroTest data={heroData} />
        {/* <Lead /> */}
        <Featured />
        <Expertise />
        <Working />
        <PriceEstimator />
        {/* <Interior /> */}
        <Testimonials />
        <Video />
        {/* <Lead /> */}
        <Footer />
      </main>
      {/* </div> */}
    </>
  );
}
