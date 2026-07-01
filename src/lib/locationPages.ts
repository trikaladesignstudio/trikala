import type { LocationPageData, LocationStateGroup } from "@/lib/locationTypes";
import {
  fetchLocationsFromSheets,
  readLocationSnapshot,
} from "@/lib/locationSnapshot";
import { cache } from "react";

const loadAllLocations = cache(async (): Promise<LocationPageData[]> => {
  const snapshot = readLocationSnapshot();
  if (snapshot) return snapshot;
  return fetchLocationsFromSheets();
});

export async function getAllLocations(): Promise<LocationPageData[]> {
  return loadAllLocations();
}

export async function getLocationBySlug(
  slug: string,
): Promise<LocationPageData | null> {
  const locations = await loadAllLocations();
  return locations.find((loc) => loc.slug === slug) ?? null;
}

export function groupLocationsByState(
  locations: LocationPageData[],
): LocationStateGroup[] {
  const map = new Map<string, LocationPageData[]>();

  for (const location of locations) {
    const existing = map.get(location.state) ?? [];
    existing.push(location);
    map.set(location.state, existing);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, stateLocations]) => ({
      state,
      locations: stateLocations.sort((a, b) => a.city.localeCompare(b.city)),
    }));
}

export function enrichLocationWithProjects<
  T extends { images: { url: string }[] },
>(
  location: LocationPageData,
  projects: T[],
): LocationPageData {
  const heroFromProject = projects.find((p) => p.images[0]?.url)?.images[0]
    ?.url;
  const inlineFromProject = projects.find(
    (p, i) => i === 1 && p.images[0]?.url,
  )?.images[0]?.url;

  const heroImage =
    heroFromProject ??
    (location.heroImage.startsWith("/static/")
      ? `https://picsum.photos/seed/trikala-${location.slug}/900/1125`
      : location.heroImage);

  return {
    ...location,
    heroImage,
    inlineImage: inlineFromProject ?? location.inlineImage,
  };
}
