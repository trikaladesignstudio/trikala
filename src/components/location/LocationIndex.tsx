"use client";

import Heading from "@/components/custom/Heading";
import LocationBreadcrumb from "@/components/location/LocationBreadcrumb";
import type { LocationStateGroup } from "@/lib/locationTypes";
import {
  locationBodyClass,
  locationEmphasisClass,
  locationHeadingClass,
  locationFocusRing,
  locationLabelClass,
  locationSectionCanvas,
  locationSectionPad,
} from "@/components/location/locationStyles";
import { cn, rollInView } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

type LocationIndexProps = {
  groups: LocationStateGroup[];
  totalCount: number;
};

function formatInr(value: number) {
  return value.toLocaleString("en-IN");
}

export default function LocationIndex({ groups, totalCount }: LocationIndexProps) {
  const [query, setQuery] = useState("");
  const stateCount = groups.length;

  const filteredGroups = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return groups;

    return groups
      .map((group) => ({
        ...group,
        locations: group.locations.filter(
          (location) =>
            location.city.toLowerCase().includes(trimmed) ||
            location.state.toLowerCase().includes(trimmed),
        ),
      }))
      .filter((group) => group.locations.length > 0);
  }, [groups, query]);

  const filteredCount = filteredGroups.reduce(
    (sum, group) => sum + group.locations.length,
    0,
  );

  return (
    <section className={locationSectionCanvas}>
      <div className={locationSectionPad}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-12 lg:gap-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
            <div className="flex flex-col gap-4">
              <LocationBreadcrumb />
              <Heading
                className="text-left text-4xl md:text-5xl lg:text-6xl"
                text="Locations we serve"
              />
              <p className={locationBodyClass}>
                Architecture and interior design across India. Select your city
                for local pricing, services, and project consultation.
              </p>
            </div>
            <div className="border-l-2 border-custom-lb pl-5 lg:pl-6">
              <span className={locationLabelClass}>Coverage</span>
              <p
                className={cn(
                  locationEmphasisClass,
                  "mt-2 text-4xl md:text-5xl",
                )}
              >
                {totalCount}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                {stateCount} {stateCount === 1 ? "state" : "states"} — architecture
                and interior design studios across India.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="location-search" className={locationLabelClass}>
              Search cities
            </label>
            <input
              id="location-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by city or state…"
              className={cn(
                "h-11 w-full max-w-md rounded-md border border-zinc-300/80 bg-white px-4 text-base text-zinc-900",
                "placeholder:text-zinc-400",
                locationFocusRing,
              )}
            />
            {query.trim() ? (
              <p className="text-sm text-zinc-500">
                {filteredCount} {filteredCount === 1 ? "city" : "cities"} match
                &ldquo;{query.trim()}&rdquo;
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-10 lg:gap-12">
            {filteredGroups.length === 0 ? (
              <p className={locationBodyClass}>
                No cities match your search. Try a different name or clear the
                filter.
              </p>
            ) : (
              filteredGroups.map((group, groupIndex) => (
                <motion.section
                  key={group.state}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: groupIndex * 0.05,
                  }}
                >
                  <div className="mb-5 flex items-baseline gap-4 border-b border-zinc-200/60 pb-4">
                    <h2
                      className={cn(
                        locationHeadingClass,
                        "text-2xl md:text-3xl",
                      )}
                    >
                      {group.state}
                    </h2>
                    <span className={locationLabelClass}>
                      {group.locations.length}{" "}
                      {group.locations.length === 1 ? "city" : "cities"}
                    </span>
                  </div>

                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.locations.map((location, index) => (
                      <motion.li
                        key={location.slug}
                        variants={rollInView}
                        viewport={{ once: true }}
                        initial="base"
                        whileInView="show"
                        transition={{
                          ...rollInView.transition,
                          delay: 0.05 + index * 0.03,
                        }}
                      >
                        <Link
                          href={`/locations/${location.slug}`}
                          className={cn(
                            "group flex items-center justify-between gap-3 rounded-xl border border-transparent border-l-2 px-4 py-3.5",
                            "transition-all duration-300",
                            "hover:border-zinc-200/80 hover:border-l-custom-lb hover:bg-white",
                            "active:scale-[0.99]",
                            locationFocusRing,
                          )}
                        >
                          <div className="min-w-0">
                            <span
                              className={cn(
                                locationEmphasisClass,
                                "block text-lg md:text-xl",
                              )}
                            >
                              {location.city}
                            </span>
                            <span className="block text-xs leading-relaxed text-zinc-500">
                              Architects &amp; interior designers
                            </span>
                            {location.priceLow > 0 && location.priceHigh > 0 ? (
                              <span className="mt-1 block text-xs tabular-nums text-zinc-600">
                                ₹{formatInr(location.priceLow)}–₹
                                {formatInr(location.priceHigh)} / sq ft
                              </span>
                            ) : null}
                          </div>
                          <ArrowRightIcon
                            className="size-4 shrink-0 text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-custom-lb"
                            aria-hidden
                          />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
