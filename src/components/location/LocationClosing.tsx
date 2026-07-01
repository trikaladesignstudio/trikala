"use client";

import {
  locationHeadingClass,
  locationFocusRing,
  locationPrimaryBtn,
  locationSectionCanvas,
  locationSectionPad,
  locationSectionScrollMt,
} from "@/components/location/locationStyles";
import { locationNearbyLinkLabel } from "@/lib/locationCopy";
import type { LocationPageData } from "@/lib/locationTypes";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";

type LocationClosingProps = {
  location: LocationPageData;
  ctaLink: string;
};

export default function LocationClosing({
  location,
  ctaLink,
}: LocationClosingProps) {
  const hasNearby = location.nearbyCities.length > 0;

  return (
    <section className={locationSectionCanvas}>
      <div className={cn(locationSectionPad, "pb-16 lg:pb-24")}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-12 lg:gap-16">
          {hasNearby ? (
            <div className="flex flex-col gap-5 border-b border-zinc-200/60 pb-12 lg:pb-14">
              <h2 className={cn(locationHeadingClass, "text-2xl md:text-3xl")}>
                Also serving nearby
              </h2>
              <ul className="flex flex-wrap gap-3">
                {location.nearbyCities.map(({ slug, city }, index) => (
                  <li key={slug}>
                    <Link
                      href={`/locations/${slug}`}
                      className={cn(
                        "inline-flex min-h-[44px] items-center rounded-full border border-zinc-200/80 bg-white px-5 py-2",
                        "text-sm font-medium text-zinc-700 transition-colors",
                        "hover:border-custom-lb hover:text-custom-lb",
                        locationFocusRing,
                      )}
                    >
                      {locationNearbyLinkLabel(city, index)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={cn(
              "flex flex-col items-start justify-between gap-8 rounded-[2.5rem] bg-black px-8 py-12 md:flex-row md:items-center md:gap-12 md:px-14 md:py-14",
              locationSectionScrollMt,
            )}
          >
            <div className="flex max-w-xl flex-col gap-3">
              <h2
                className={cn(
                  locationHeadingClass,
                  "text-2xl text-white md:text-4xl",
                )}
              >
                Ready to start in {location.city}?
              </h2>
              <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
                Share your brief on WhatsApp — we respond with next steps and a
                consultation slot.
              </p>
            </div>
            <Link
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(locationPrimaryBtn, "shrink-0 px-6")}
            >
              Start a project
              <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
