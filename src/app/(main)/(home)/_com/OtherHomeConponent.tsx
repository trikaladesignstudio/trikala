import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import Expertise from "@/components/sections/ExpertiseTest";
import Featured from "@/components/sections/Feature";
import PriceEstimator from "@/components/sections/PriceEstimator";
import Testimonials from "@/components/sections/Testimonials";
import Video from "@/components/sections/Video";
import Working from "@/components/sections/Working";

export default async function OtherHomeConponent() {
  const [workingData, testimonialData] = await Promise.all([
    filterAllProjects(sectionType.working),
    filterAllProjects(sectionType.testimonials),
  ]);

  return (
    <>
      <Featured />
      <Expertise />
      <Working data={workingData} />
      <Testimonials data={testimonialData} />
      <PriceEstimator />
      <Video />
    </>
  );
}
