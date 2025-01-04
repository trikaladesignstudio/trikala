// import Lead from "@/components/sections/custom/Lead";
import { Fragment, Suspense } from "react";
import FasterHome from "./_com/FastestHero";
import OtherHomeConponent from "./_com/OtherHomeConponent";

export const revalidate = 300;

export default async function Home() {
  return (
    <Fragment>
      <FasterHome />
      <Suspense>
        <OtherHomeConponent />
      </Suspense>
    </Fragment>
  );
}
