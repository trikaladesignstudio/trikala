"use cache";
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
    <section className="w-full bg-[#f5f5f5]">
      <div className="page-x py-6 lg:py-10">
        <Suspense>
          <ProjectShowClient projects={projects} />
        </Suspense>
      </div>
    </section>
  );
}
