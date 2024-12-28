// import Lead from "@/components/sections/custom/Lead";
import { Suspense } from "react";
import FasterHome from "./_com/FastestHero";
import OtherHomeConponent from "./_com/OtherHomeConponent";

export const revalidate = 300;

export default async function Home() {
  return (
    <>
      <FasterHome />
      <Suspense>
        <OtherHomeConponent />
      </Suspense>
    </>
  );
}
