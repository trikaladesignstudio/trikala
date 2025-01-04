"use client";

import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Heading from "./Heading";
import Section from "./Section";
const RenderPdf = dynamic(() => import("./RenderPdf"), {
  ssr: false,
});

export default function ProjectViewClient({
  projectData,
}: {
  projectData: Prisma.ProjectCreateInput;
}) {
  const [project, _] = useState<Prisma.ProjectCreateInput>(projectData);

  return (
    <div className="flex flex-col gap-4 min-h-full w-full justify-start">
      <Section
        toSnap={false}
        className="gap-4 flex flex-col min-h-fit justify-start"
      >
        <Heading className="text-left " text={project.title} />
        <p className="text-lg ">{project.description}</p>
        <p className="text-lg border border-black w-full" />
      </Section>
      {projectData.pdf && (
        <div className="mb-4">
          <RenderPdf url={projectData.pdf.url as string} />
        </div>
      )}
    </div>
  );
}
