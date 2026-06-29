"use cache";
import { FormattedText } from "@/components/custom/FormattedText";
import JsonLd from "@/components/seo/JsonLd";
import ProjectViewClient from "@/components/custom/ProjectViewClient";
import Section from "@/components/custom/Section";
import { SITE_URL } from "@/lib/seo";
import { getProject } from "@/utils/dbActions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const project = await getProject(id);
  if (!project) return {};

  const image = project.images?.[0]?.url ?? "/static/logo.webp";

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: image }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [image],
    },
    alternates: { canonical: `/projects/${project.id}` },
  };
}

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
    notFound();
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: projectData.title,
    description: projectData.description,
    url: `${SITE_URL}/projects/${projectData.id}`,
    image: projectData.images?.[0]?.url,
    datePublished: projectData.createdAt?.toISOString(),
    creator: {
      "@type": "Organization",
      name: "Trikal Architects",
      url: SITE_URL,
    },
  };

  return (
    <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-fit justify-start bg-[#f5f5f5] pb-16 lg:pb-24">
      <JsonLd data={projectJsonLd} />
      <article className="flex w-full flex-col">
        <header className="page-x flex shrink-0 flex-col gap-3 py-6 lg:py-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-silver text-left text-zinc-900">
            {projectData.title}
          </h1>
          <FormattedText className="max-w-3xl text-base text-zinc-700 lg:text-lg">
            {projectData.description}
          </FormattedText>
        </header>

        <ProjectViewClient projectData={projectData} />
      </article>
    </Section>
  );
}
