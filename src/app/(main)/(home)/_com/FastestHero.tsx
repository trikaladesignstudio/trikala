"use server";
import Hero from "@/components/sections/Hero";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";

export default async function FasterHome() {
  const heroData = await filterAllProjects(sectionType.hero);
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
      <Hero pData={Promise.resolve(heroData)} />
    </>
  );
}
