import FeaturedMenu from "@/components/custom/FeaturedMenu";
import { featuredProjectsToMenuItems } from "@/lib/heroFeaturedUtils";
import { getAllFeaturedProjects } from "@/utils/dbActions";

export default async function FeaturedHome() {
  const featured = await getAllFeaturedProjects();
  const items = featuredProjectsToMenuItems(featured);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <FeaturedMenu items={items} />
    </div>
  );
}
