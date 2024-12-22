import PriceEstimator from "@/components/sections/PriceEstimatorTest";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense>
      <PriceEstimator />
    </Suspense>
  );
}
