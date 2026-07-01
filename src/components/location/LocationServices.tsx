"use client";

import Heading from "@/components/custom/Heading";
import {
  locationBodyLargeClass,
  locationHeadingClass,
  locationLabelClass,
  locationSectionPad,
  locationSectionScrollMt,
  locationSectionSurface,
} from "@/components/location/locationStyles";
import { locationServiceDescription, locationServiceHeading } from "@/lib/locationCopy";
import type { LocationPageData } from "@/lib/locationTypes";
import { cn, rollInView } from "@/lib/utils";
import { ProjectType } from "@/utils/client_utils";
import { motion } from "framer-motion";

const services = [
  ProjectType.Architecture,
  ProjectType.Interior,
  ProjectType.Landscape,
  ProjectType.UrbanDesign,
] as const;

type LocationServicesProps = {
  location: LocationPageData;
};

export default function LocationServices({ location }: LocationServicesProps) {
  const ctx = { city: location.city, state: location.state };

  return (
    <section
      id="services"
      className={cn(locationSectionSurface, locationSectionScrollMt)}
    >
      <div
        className={cn(
          locationSectionPad,
          "mx-auto flex max-w-[1400px] flex-col gap-10 lg:gap-14",
        )}
      >
        <div className="flex max-w-[65ch] flex-col gap-3 lg:max-w-[65ch]">
          <Heading
            className="text-left text-3xl md:text-5xl lg:text-6xl"
            text="What we design"
          />
          <p className={locationBodyLargeClass}>
            Architecture, interior design, landscape, and urban planning — one
            studio for projects across {location.city}.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-zinc-200/60 border-y border-zinc-200/60">
          {services.map((type, index) => {
            const reverse = index % 2 === 1;
            return (
              <motion.div
                key={type}
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{
                  ...rollInView.transition,
                  delay: 0.1 + index * 0.08,
                }}
                className={cn(
                  "grid grid-cols-1 gap-4 py-8 transition-colors duration-300 md:grid-cols-2 md:items-start md:gap-12 md:py-10",
                  "hover:bg-zinc-50/80",
                  reverse && "md:[&>*:first-child]:order-2",
                )}
              >
                <div className="flex flex-col gap-2 px-0 md:px-2">
                  <span className={locationLabelClass}>0{index + 1}</span>
                  <h3
                    className={cn(
                      locationHeadingClass,
                      "text-2xl md:text-3xl",
                    )}
                  >
                    {locationServiceHeading(type, ctx)}
                  </h3>
                </div>
                <p className={cn(locationBodyLargeClass, "max-w-[55ch] md:px-2")}>
                  {locationServiceDescription(type, ctx)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
