import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { images } from "@/types";
import type { Project } from "@prisma/client";

const MAX_FEATURED_MENU_ITEMS = 16;

export const FALLBACK_MENU_ITEMS: InfiniteMenuItem[] = [
  {
    image: "/static/logo.webp",
    link: "/projects",
    title: "Featured Work",
    description: "Explore our portfolio of architecture and design.",
  },
];

export function featuredProjectsToMenuItems(
  projects: Project[]
): InfiniteMenuItem[] {
  if (!projects.length) return FALLBACK_MENU_ITEMS;

  const items: InfiniteMenuItem[] = [];

  for (const project of projects) {
    if (items.length >= MAX_FEATURED_MENU_ITEMS) break;

    const projectImages = project.images as images[] | undefined;
    const firstImage = projectImages?.find((image) => image.url);
    if (!firstImage?.url) continue;

    const hasProjectPage = Boolean(project.pdf && project.id);
    items.push({
      image: firstImage.url,
      link: hasProjectPage ? `/projects/${project.id}` : undefined,
      title: project.title,
      description: project.description?.slice(0, 120) ?? "",
    });
  }

  return items.length > 0 ? items : FALLBACK_MENU_ITEMS;
}
