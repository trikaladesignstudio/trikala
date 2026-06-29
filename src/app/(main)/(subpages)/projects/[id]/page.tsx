"use cache";
import JsonLd from "@/components/seo/JsonLd";
import ProjectViewClient from "@/components/custom/ProjectViewClient";
import Section from "@/components/custom/Section";
import { SITE_URL } from "@/lib/seo";
import { getProject } from "@/utils/dbActions";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

  const images = Array.isArray(projectData.images) ? projectData.images : [];

  return (
    <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-fit justify-start bg-[#f5f5f5]">
      <JsonLd data={projectJsonLd} />
      <article className="flex flex-col gap-4 min-h-full w-full justify-start page-x py-10">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-tight font-silver text-left text-zinc-900">
            {projectData.title}
          </h1>
          <p className="text-lg text-zinc-700">{projectData.description}</p>
          {projectData.pdf?.url && (
            <p>
              <Link
                href={projectData.pdf.url}
                className="text-sm underline text-zinc-600 hover:text-zinc-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download project PDF
              </Link>
            </p>
          )}
        </header>

        {images.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={image.url ?? index}
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Image
                  src={image.url}
                  alt={`${projectData.title} — image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <ProjectViewClient projectData={projectData} />
      </article>
    </Section>
  );
}
