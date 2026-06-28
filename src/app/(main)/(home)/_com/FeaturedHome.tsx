import { FeaturedSectionContent } from "@/components/sections/FeaturedSection";
import { featuredProjectsToMenuItems } from "@/lib/heroFeaturedUtils";
import { getAllFeaturedProjects } from "@/utils/dbActions";

const PRELOAD_IMAGE_COUNT = 8;

export default async function FeaturedHome() {
  const featured = await getAllFeaturedProjects();
  const items = featuredProjectsToMenuItems(featured);
  const preloadUrls = [
    ...new Set(items.map((item) => item.image).filter(Boolean)),
  ].slice(0, PRELOAD_IMAGE_COUNT);

  return (
    <>
      {preloadUrls.map((url, index) => (
        <link
          key={url}
          rel="preload"
          as="image"
          href={url}
          fetchPriority={index < 2 ? "high" : "low"}
        />
      ))}
      <FeaturedSectionContent items={items} />
    </>
  );
}
