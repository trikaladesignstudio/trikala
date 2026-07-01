import { images } from "@/types";
import { getAllProjects } from "@/utils/dbActions";
import { sectionType } from "@/utils/client_utils";

export type AdminProject = {
  id: string;
  title: string;
  description: string;
  section: string;
  type: string;
  featured: boolean;
  images: images[];
  pdf: { url: string; name: string } | null;
};

export const sectionLabels: Record<sectionType, string> = {
  [sectionType.hero]: "Hero",
  [sectionType.features]: "Featured Work",
  [sectionType.expertise]: "Expertise",
  [sectionType.priceEstimator]: "Price Estimator",
  [sectionType.working]: "Working Process",
  [sectionType.testimonials]: "Testimonials",
  [sectionType.contact]: "Contact & Footer",
  [sectionType.none]: "Unassigned",
};

export const sidebarSections = Object.values(sectionType).filter(
  (section) => section !== sectionType.none
);

export function toAdminProject(
  project: Awaited<ReturnType<typeof getAllProjects>>[number]
): AdminProject | null {
  if (!project.id) return null;

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    section: project.section,
    type: project.type,
    featured: project.featured,
    images: Array.isArray(project.images) ? project.images : [],
    pdf: project.pdf ?? null,
  };
}

export function filterProjectsWithPdf(projects: AdminProject[]) {
  return projects.filter((project) => Boolean(project.pdf?.url));
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  const raw = await getAllProjects();
  return raw
    .map(toAdminProject)
    .filter((project): project is AdminProject => project !== null);
}

export function buildSectionCounts(projects: AdminProject[]) {
  return Object.values(sectionType).reduce<Record<string, number>>(
    (acc, section) => {
      acc[section] = projects.filter((p) => p.section === section).length;
      return acc;
    },
    {}
  );
}

