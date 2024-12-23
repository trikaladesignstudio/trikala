import Heading from "@/components/custom/Heading";
import Section from "@/components/custom/Section";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Section>
      <Heading className="text-left text-black" text="Projects" />
      <Suspense>this is projects</Suspense>
    </Section>
  );
}
