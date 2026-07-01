import { getAllLocations } from "@/lib/locationPages";
import { SITE_URL } from "@/lib/seo";
import { getAllProjectsByPDF } from "@/utils/dbActions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjectsByPDF();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/aboutus`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacyPolicy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termAndCondition`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    lastModified: project.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const locationPages: MetadataRoute.Sitemap = (await getAllLocations()).map(
    (loc) => ({
      url: `${SITE_URL}/locations/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [...staticPages, ...locationPages, ...projectPages];
}
