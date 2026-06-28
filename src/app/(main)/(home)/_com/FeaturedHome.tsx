import { FeaturedSectionContent } from "@/components/sections/FeaturedSection";
import { featuredProjectsToMenuItems } from "@/lib/heroFeaturedUtils";
import { getAllFeaturedProjects } from "@/utils/dbActions";

export default async function FeaturedHome() {
  const featured = await getAllFeaturedProjects();

  return (
    <FeaturedSectionContent items={featuredProjectsToMenuItems(featured)} />
  );
}
