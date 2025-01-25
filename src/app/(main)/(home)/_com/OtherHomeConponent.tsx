import { sectionType } from "@/utils/client_utils";
import {
  filterAllProjects,
  getAllProjectsGroupByType,
} from "@/utils/dbActions";
import Expertise from "@/components/sections/ExpertiseTest2";
import Featured from "@/components/sections/Feature";
import PriceEstimator from "@/components/sections/PriceEstimator";
import Testimonials from "@/components/sections/Testimonials";
import Video from "@/components/sections/Video";
import Working from "@/components/sections/Working";

export default async function OtherHomeConponent() {
  const [workingData, testimonialData, expertiseData, priceEstimatorData] =
    await Promise.all([
      filterAllProjects(sectionType.working),
      filterAllProjects(sectionType.testimonials),
      getAllProjectsGroupByType(),
      filterAllProjects(sectionType.priceEstimator),
    ]);

  return (
    <>
      <Featured />
      <Expertise data={expertiseData} />
      <Working data={workingData} />
      <Testimonials data={testimonialData} />
      <PriceEstimator data={priceEstimatorData} />
      <Video />
    </>
  );
}
