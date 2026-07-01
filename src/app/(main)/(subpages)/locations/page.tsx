import LocationIndex from "@/components/location/LocationIndex";
import {
  getAllLocations,
  groupLocationsByState,
} from "@/lib/locationPages";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = buildPageMetadata({
  title: "Locations",
  description:
    "Find Trikala Architects in your city — architecture and interior design services across India with local pricing and consultation.",
  path: "/locations",
});

export default async function LocationsPage() {
  const locations = await getAllLocations();
  const groups = groupLocationsByState(locations);

  return (
    <LocationIndex groups={groups} totalCount={locations.length} />
  );
}
