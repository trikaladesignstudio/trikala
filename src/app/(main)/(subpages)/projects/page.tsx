"use cache";
import Heading from "@/components/custom/Heading";
import ProjectShowClient from "@/components/custom/projectShowClient";
import Section from "@/components/custom/Section";
import { getAllProjectsByPDF } from "@/utils/dbActions";
import { Suspense } from "react";

export default async function Home() {
  const projects = await getAllProjectsByPDF();

  return (
    <Section className="justify-start gap-12">
      <Heading className="text-left text-black" text="Projects" />
      <Suspense>
        <ProjectShowClient projects={projects} />
      </Suspense>
    </Section>
  );
}
