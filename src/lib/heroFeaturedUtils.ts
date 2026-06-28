import type { InfiniteMenuItem } from "@/components/custom/InfiniteMenu/InfiniteMenu";
import { images } from "@/types";
import type { getAllFeaturedProjects } from "@/utils/dbActions";

type FeaturedProjects = Awaited<ReturnType<typeof getAllFeaturedProjects>>;

export type FeaturedProjectsData = FeaturedProjects;

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
      const projectImages = project.images as images[] | undefined;
      if (!projectImages?.length) return;

      const hasProjectPage = Boolean(project.pdf && project.id);
      const link = hasProjectPage ? `/projects/${project.id}` : undefined;

      projectImages.forEach((image) => {
        if (!image.url) return;

        items.push({
          image: image.url,
          link,
          title: project.title,
          description: project.description?.slice(0, 120) ?? "",
        });
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
