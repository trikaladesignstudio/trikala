import Hero from "@/components/sections/Hero";
import { resolveStartAProjectLink } from "@/lib/contactData";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects, getContactProjects } from "@/utils/dbActions";

export default async function FasterHome() {
  const [heroData, contactProjects] = await Promise.all([
    filterAllProjects(sectionType.hero),
    getContactProjects(),
  ]);
  const startAProjectLink = resolveStartAProjectLink(contactProjects);
  const firstImageUrl = heroData?.[0]?.images?.[0]?.url;

  return (
    <>
      {firstImageUrl && (
        <link
          rel="preload"
          as="image"
          href={firstImageUrl}
          fetchPriority="high"
        />
      )}
      <Hero
        pData={Promise.resolve(heroData)}
        startAProjectLink={startAProjectLink}
      />
    </>
  );
}
