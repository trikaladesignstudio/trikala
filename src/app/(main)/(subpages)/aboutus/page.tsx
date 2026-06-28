import sampleSize from "lodash/sampleSize";
import { getAllProjectsGroupByType } from "@/utils/dbActions";
import { unstable_noStore as noStore } from "next/cache";
import AboutApproach from "./_com/AboutApproach";
import AboutHero from "./_com/AboutHero";
import ThrivePrinciples from "./_com/ThrivePrinciples";

export const dynamic = "force-dynamic";

function extractExpertiseImageUrls(
  expertiseData: Awaited<ReturnType<typeof getAllProjectsGroupByType>>
) {
  return expertiseData
    .flatMap((category) => category.images ?? [])
    .map((image) => image.url)
    .filter((url): url is string => Boolean(url));
}

function pickTwoRandomImages(urls: string[]) {
  if (urls.length === 0) {
    return {
      heroImage: "/static/images/cover.svg",
      inlineImage: "/static/logo.webp",
    };
  }

  if (urls.length === 1) {
    return { heroImage: urls[0], inlineImage: urls[0] };
  }

  const [heroImage, inlineImage] = sampleSize(urls, 2);
  return { heroImage, inlineImage };
}

export default async function AboutUs() {
  noStore();

  const expertiseData = await getAllProjectsGroupByType();
  const imageUrls = extractExpertiseImageUrls(expertiseData);
  const { heroImage, inlineImage } = pickTwoRandomImages(imageUrls);

  return (
    <>
      <AboutHero heroImage={heroImage} inlineImage={inlineImage} />
      <AboutApproach />
      <ThrivePrinciples />
    </>
  );
}
