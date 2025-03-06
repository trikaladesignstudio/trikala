import { BarGraph } from "@/components/custom/BarGraph";
import PriceEstimator from "@/components/sections/PriceEstimator";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";

// price data input format
// state, city
// cost interior sqft, construction sqft

export default async function page() {
  // const [priceEstimatorData] = await Promise.all([
  //   filterAllProjects(sectionType.priceEstimator),
  // ]);
  return <BarGraph totalValue={100000} days={100} />;
}
