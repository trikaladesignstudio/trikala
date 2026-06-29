"use cache";
import Heading from "@/components/custom/Heading";
import ProjectShowClient from "@/components/custom/projectShowClient";
import { buildPageMetadata } from "@/lib/seo";
import { getAllProjectsByPDF } from "@/utils/dbActions";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Explore Trikal Architects portfolio — residential, commercial, interior, and landscape design projects across India.",
  path: "/projects",
});

export default async function Home() {
  const projects = await getAllProjectsByPDF();

  return (
    <section className="w-full bg-white">
      <div className="page-x py-10 lg:py-16">
        <div className="mb-8 flex flex-col gap-3 lg:mb-12">
          <Heading
            className="text-left text-zinc-900"
            text="Projects"
            customDelay={0.1}
          />
          <div className="h-px w-12 bg-zinc-300" />
        </div>

        <Suspense>
          <ProjectShowClient projects={projects} />
        </Suspense>
      </div>
    </section>
  );
}
