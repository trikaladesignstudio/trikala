import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { images } from "@/types";
import type { getAllFeaturedProjects } from "@/utils/dbActions";

type FeaturedProjects = Awaited<ReturnType<typeof getAllFeaturedProjects>>;

export type FeaturedProjectsData = FeaturedProjects;

const MAX_FEATURED_MENU_ITEMS = 16;

export function featuredProjectsToMenuItems(
  featuredData: FeaturedProjects
): InfiniteMenuItem[] {
  if (!featuredData || Array.isArray(featuredData)) {
    return fallbackMenuItems();
  }

  const items: InfiniteMenuItem[] = [];

  Object.values(featuredData)
    .flat()
    .forEach((project) => {
      if (items.length >= MAX_FEATURED_MENU_ITEMS) return;

      const projectImages = project.images as images[] | undefined;
      const firstImage = projectImages?.find((image) => image.url);
      if (!firstImage?.url) return;

      const hasProjectPage = Boolean(project.pdf && project.id);
      const link = hasProjectPage ? `/projects/${project.id}` : undefined;

      items.push({
        image: firstImage.url,
        link,
        title: project.title,
        description: project.description?.slice(0, 120) ?? "",
      });
    });

  return items.length > 0 ? items : fallbackMenuItems();
}

function fallbackMenuItems(): InfiniteMenuItem[] {
  return [
    {
      image: "/static/logo.webp",
      link: "/projects",
      title: "Featured Work",
      description: "Explore our portfolio of architecture and design.",
    },
  ];
}
