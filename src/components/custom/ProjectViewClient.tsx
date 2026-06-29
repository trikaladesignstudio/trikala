"use client";

import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";

const RenderPdf = dynamic(() => import("./RenderPdf"), {
  ssr: false,
});

export default function ProjectViewClient({
  projectData,
}: {
  projectData: Prisma.ProjectCreateInput;
}) {
  if (!projectData.pdf?.url) return null;

  return (
    <div className="mb-4">
      <RenderPdf url={projectData.pdf.url as string} />
    </div>
  );
}
