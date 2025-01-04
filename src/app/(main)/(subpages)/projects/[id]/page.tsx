"use cache";
import ProjectViewClient from "@/components/custom/ProjectViewClient";
import Section from "@/components/custom/Section";
import { getProject } from "@/utils/dbActions";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (!id) {
    notFound();
  }
  const projectData = await getProject(id);
  if (!projectData) {
    // return 404 page
    notFound();
  }
  return (
    <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-fit justify-start">
      <ProjectViewClient projectData={projectData} />
    </Section>
  );
}
