import { buildPageMetadata, ORGANIZATION_JSON_LD } from "@/lib/seo";
import { getAllProjectsGroupByType } from "@/utils/dbActions";
import type { Metadata } from "next";
import AboutApproach from "./_com/AboutApproach";
import AboutHero from "./_com/AboutHero";
import ThrivePrinciples from "./_com/ThrivePrinciples";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Learn about Trikal Architects — our design philosophy, team, and approach to architecture, interiors, and landscape across Delhi NCR.",
  path: "/aboutus",
});

function extractExpertiseImageUrls(
  expertiseData: Awaited<ReturnType<typeof getAllProjectsGroupByType>>
) {
  return expertiseData
    .flatMap((category) => category.images ?? [])
    .map((image) => image.url)
    .filter((url): url is string => Boolean(url));
}

function pickDeterministicImages(urls: string[]) {
  if (urls.length === 0) {
    return {
      heroImage: "/static/images/cover.svg",
      inlineImage: "/static/logo.webp",
    };
  }

  if (urls.length === 1) {
    return { heroImage: urls[0], inlineImage: urls[0] };
  }

  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const heroIndex = weekIndex % urls.length;
  const inlineIndex = (weekIndex + 1) % urls.length;

  return {
    heroImage: urls[heroIndex],
    inlineImage: urls[inlineIndex],
  };
}

export default async function AboutUs() {
  const expertiseData = await getAllProjectsGroupByType();
  const imageUrls = extractExpertiseImageUrls(expertiseData);
  const { heroImage, inlineImage } = pickDeterministicImages(imageUrls);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <AboutHero heroImage={heroImage} inlineImage={inlineImage} />
      <AboutApproach />
      <ThrivePrinciples />
    </>
  );
}
