import { BarGraph } from "@/components/custom/BarGraph";

// price data input format
// state, city
// cost interior sqft, construction sqft

export default async function page() {
  // const [priceEstimatorData] = await Promise.all([
  //   filterAllProjects(sectionType.priceEstimator),
  // ]);
  return <BarGraph totalValue={100000} days={100} />;
}
