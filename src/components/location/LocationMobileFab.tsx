"use client";

import { locationFocusRing } from "@/components/location/locationStyles";
import { cn } from "@/lib/utils";
import Link from "next/link";

type LocationMobileFabProps = {
  ctaLink: string;
  city: string;
};

export default function LocationMobileFab({
  ctaLink,
  city,
}: LocationMobileFabProps) {
  return (
    <Link
      href={ctaLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Start a project in ${city} on WhatsApp`}
      className={cn(
        "fixed bottom-6 right-4 z-40 flex h-12 min-h-[44px] items-center rounded-full px-5 lg:hidden",
        "bg-custom-lb text-sm font-medium text-white shadow-[0_12px_28px_-8px_rgba(119,73,49,0.55)]",
        "transition-transform active:scale-[0.98]",
        locationFocusRing,
      )}
    >
      WhatsApp us
    </Link>
  );
}
