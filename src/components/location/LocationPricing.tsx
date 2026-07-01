"use client";

import {
  locationBodyClass,
  locationBodyLargeClass,
  locationHeadingClass,
  locationLabelClass,
  locationPriceClass,
  locationPrimaryBtn,
  locationSectionCanvas,
  locationSectionPadCompact,
  locationSectionScrollMt,
} from "@/components/location/locationStyles";
import { locationPricingHeading } from "@/lib/locationCopy";
import type { LocationPageData } from "@/lib/locationTypes";
import { cn, rollInView } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";

export type LocationPriceContext = {
  minLow: number;
  maxHigh: number;
};

type LocationPricingProps = {
  location: LocationPageData;
  priceContext?: LocationPriceContext;
};

function formatInr(value: number) {
  return value.toLocaleString("en-IN");
}

function PriceBand({
  priceLow,
  priceHigh,
  priceContext,
}: {
  priceLow: number;
  priceHigh: number;
  priceContext?: LocationPriceContext;
}) {
  if (!priceContext) return null;

  const { minLow, maxHigh } = priceContext;
  const range = maxHigh - minLow;
  if (range <= 0) return null;

  const leftPct = ((priceLow - minLow) / range) * 100;
  const widthPct = Math.max(((priceHigh - priceLow) / range) * 100, 4);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>₹{formatInr(minLow)}</span>
        <span>₹{formatInr(maxHigh)}</span>
      </div>
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200/80"
        role="img"
        aria-label={`Price range from ₹${formatInr(priceLow)} to ₹${formatInr(priceHigh)} per sq ft`}
      >
        <div
          className="absolute top-0 h-full rounded-full bg-custom-lb/70"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">
        Indicative band relative to other cities we serve
      </p>
    </div>
  );
}

export default function LocationPricing({
  location,
  priceContext,
}: LocationPricingProps) {
  const hasPricing = location.priceLow > 0 && location.priceHigh > 0;

  return (
    <section
      id="estimate"
      className={cn(locationSectionCanvas, locationSectionScrollMt)}
    >
      <div className={locationSectionPadCompact}>
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            variants={rollInView}
            viewport={{ once: true }}
            initial="base"
            whileInView="show"
            transition={rollInView.transition}
            className="rounded-[2.5rem] border border-zinc-200/50 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] md:p-10 lg:p-12"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="flex flex-col gap-6 lg:max-w-[70%]">
                <div className="flex flex-col gap-2">
                  <span className={locationLabelClass}>Indicative pricing</span>
                  <h2
                    className={cn(
                      locationHeadingClass,
                      "text-3xl md:text-4xl",
                    )}
                  >
                    {locationPricingHeading(location)}
                  </h2>
                </div>

                {hasPricing ? (
                  <>
                    <p className={locationBodyLargeClass}>
                      Typical interior design cost in {location.city},{" "}
                      {location.state}:{" "}
                      <span className={locationPriceClass}>
                        ₹{formatInr(location.priceLow)}–₹
                        {formatInr(location.priceHigh)}
                      </span>{" "}
                      per sq ft. Final quote depends on scope, materials, and
                      site conditions.
                    </p>
                    <PriceBand
                      priceLow={location.priceLow}
                      priceHigh={location.priceHigh}
                      priceContext={priceContext}
                    />
                  </>
                ) : (
                  <p className={locationBodyLargeClass}>
                    Contact us for an indicative quote for your project in{" "}
                    {location.city}.
                  </p>
                )}

                <p className="text-sm leading-relaxed text-zinc-500">
                  Figures are indicative only. A detailed estimate follows site
                  visit and design brief.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 border-t border-zinc-100 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className={cn(locationBodyClass, "max-w-[24ch] text-sm")}>
                  Build a full cost breakdown for {location.city} on our
                  calculator.
                </p>
                <Link href="/#price-estimator" className={cn(locationPrimaryBtn, "w-fit")}>
                  Open cost calculator
                  <ArrowRightIcon className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
