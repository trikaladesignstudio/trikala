import LocationClosing from "@/components/location/LocationClosing";
import LocationHero from "@/components/location/LocationHero";
import LocationMobileFab from "@/components/location/LocationMobileFab";
import LocationPricing from "@/components/location/LocationPricing";
import type { LocationPriceContext } from "@/components/location/LocationPricing";
import LocationProcess from "@/components/location/LocationProcess";
import LocationProjects from "@/components/location/LocationProjects";
import LocationSectionNav from "@/components/location/LocationSectionNav";
import LocationServices from "@/components/location/LocationServices";
import { locationMetaDescription } from "@/lib/locationCopy";
import {
  enrichLocationWithProjects,
  getAllLocations,
  getLocationBySlug,
} from "@/lib/locationPages";
import {
  DEFAULT_START_A_PROJECT_LINK,
  resolveStartAProjectLink,
} from "@/lib/contactData";
import type { LocationPageData, LocationProject } from "@/lib/locationTypes";
import { buildLocationJsonLd, buildPageMetadata } from "@/lib/seo";
import { getAllProjectsByPDF, getContactProjects } from "@/utils/dbActions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const locations = await getAllLocations();
  return locations.map(({ slug }) => ({ slug }));
}

function toLocationProjects(
  projects: Awaited<ReturnType<typeof getAllProjectsByPDF>>,
  limit = 4,
): LocationProject[] {
  return projects.slice(0, limit).flatMap((project) => {
    const imageUrl = project.images[0]?.url;
    if (!imageUrl) return [];
    return [
      {
        id: project.id,
        title: project.title,
        type: project.type,
        imageUrl,
      },
    ];
  });
}

function buildPriceContext(
  locations: LocationPageData[],
): LocationPriceContext {
  const lows = locations.map((l) => l.priceLow).filter((v) => v > 0);
  const highs = locations.map((l) => l.priceHigh).filter((v) => v > 0);

  return {
    minLow: lows.length > 0 ? Math.min(...lows) : 0,
    maxHigh: highs.length > 0 ? Math.max(...highs) : 0,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) {
    return buildPageMetadata({
      title: "Location not found",
      path: `/locations/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `Architects & Interior Designers in ${location.city}`,
    description: locationMetaDescription(location),
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const [baseLocation, allLocations] = await Promise.all([
    getLocationBySlug(slug),
    getAllLocations(),
  ]);
  if (!baseLocation) notFound();

  let projects: Awaited<ReturnType<typeof getAllProjectsByPDF>> = [];
  let ctaLink = DEFAULT_START_A_PROJECT_LINK;

  try {
    const [fetchedProjects, contactProjects] = await Promise.all([
      getAllProjectsByPDF(),
      getContactProjects(),
    ]);
    projects = fetchedProjects;
    ctaLink = resolveStartAProjectLink(contactProjects);
  } catch {
    // Pages work without DB
  }

  const location = enrichLocationWithProjects(baseLocation, projects);
  const locationProjects = toLocationProjects(projects);
  const priceContext = buildPriceContext(allLocations);
  const jsonLd = buildLocationJsonLd(location);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationHero location={location} ctaLink={ctaLink} />
      <LocationSectionNav />
      <LocationServices location={location} />
      <LocationPricing location={location} priceContext={priceContext} />
      <LocationProjects projects={locationProjects} />
      <LocationProcess />
      <LocationClosing location={location} ctaLink={ctaLink} />
      <LocationMobileFab ctaLink={ctaLink} city={location.city} />
    </>
  );
}
