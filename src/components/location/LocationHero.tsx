"use client";

import LocationBreadcrumb from "@/components/location/LocationBreadcrumb";
import {
  locationBodyClass,
  locationHeadingClass,
  locationGhostBtn,
  locationHeadlineClass,
  locationPrimaryBtn,
  locationSectionCanvas,
  locationSectionPad,
} from "@/components/location/locationStyles";
import { brurRenderVariant, cn, shimmerBlur, transition } from "@/lib/utils";
import { locationHeroSubtitle } from "@/lib/locationCopy";
import type { LocationPageData } from "@/lib/locationTypes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type LocationHeroProps = {
  location: LocationPageData;
  ctaLink: string;
};

export default function LocationHero({ location, ctaLink }: LocationHeroProps) {
  const ctx = { city: location.city, state: location.state };
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={locationSectionCanvas}>
      <div
        className={cn(
          locationSectionPad,
          "grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12",
        )}
      >
        <div className="flex flex-col gap-6 lg:pr-8">
          <LocationBreadcrumb city={location.city} />

          <h1
            className={cn(
              locationHeadingClass,
              locationHeadlineClass,
              "text-left",
            )}
          >
            <motion.span
              className="inline-block"
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0 }}
              variants={brurRenderVariant}
              initial="hidden"
              whileInView="visible"
            >
              Architects &amp; Interior Designers
            </motion.span>{" "}
            <span className="mx-1 inline-flex align-middle md:mx-2">
              <motion.span
                className="relative inline-block h-[0.75em] w-[1.1em] overflow-hidden rounded-md md:h-[0.85em] md:w-[1.25em] md:rounded-lg"
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.15 }}
                variants={brurRenderVariant}
                initial="hidden"
                whileInView="visible"
              >
                <Image
                  src={location.inlineImage}
                  alt={`${location.city} architecture detail`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={shimmerBlur}
                />
              </motion.span>
            </span>{" "}
            <motion.span
              className="inline-block"
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.3 }}
              variants={brurRenderVariant}
              initial="hidden"
              whileInView="visible"
            >
              in {location.city}
            </motion.span>
          </h1>

          <div className="h-px w-16 border-b border-custom-premium/40" />

          <motion.p
            className={cn(locationBodyClass, "text-left text-sm md:text-base")}
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.45 }}
            variants={brurRenderVariant}
            initial="hidden"
            whileInView="visible"
          >
            {locationHeroSubtitle(ctx)}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.55 }}
            variants={brurRenderVariant}
            initial="hidden"
            whileInView="visible"
          >
            <Link
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className={locationPrimaryBtn}
            >
              <span>Start a project in {location.city}</span>
              <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
            <Link href="#estimate" className={locationGhostBtn}>
              Get cost estimate
            </Link>
          </motion.div>

          <div className="h-px w-12 bg-custom-lb" />
        </div>

        <motion.div
          className={cn(
            "relative w-full overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]",
            "aspect-[4/5] min-h-[16rem]",
            "lg:min-h-[min(70svh,36rem)]",
          )}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
          variants={brurRenderVariant}
          initial="hidden"
          whileInView="visible"
        >
          <motion.div
            className="absolute inset-0"
            animate={
              prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.03, 1] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <Image
              src={location.heroImage}
              alt={`Architecture project in ${location.city}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={shimmerBlur}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/25 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
