"use server";
import HeroTest from "@/components/sections/HeroTest";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";

export default async function FasterHome() {
  const heroData = filterAllProjects(sectionType.hero);
  return <HeroTest pData={heroData} />;
}
