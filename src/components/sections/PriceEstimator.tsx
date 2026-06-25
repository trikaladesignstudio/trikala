"use client";

import { cn, rollInView } from "@/lib/utils";
import { filterAllProjects } from "@/utils/dbActions";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Heading from "../custom/Heading";
import PriceForm from "../custom/PriceForm";
import Section from "../custom/Section";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function PriceEstimator({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const [estimator, setEstimator] = useState("");

  const handleEstimator = (title: string) => {
    setEstimator(title);
  };

  const handleBack = () => {
    setEstimator("");
  };

  return (
    <Section
      id="price-estimator"
      className="min-h-[100svh] justify-center bg-zinc-50/80 py-8 lg:py-16"
    >
      {estimator === "" ? (
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 lg:gap-12">
          <div className="flex flex-col gap-3 text-center lg:gap-4 lg:text-left">
            <Heading
              className="text-center text-3xl md:text-5xl lg:text-left lg:text-7xl"
              text="Price Estimator"
            />
            <p className="mx-auto max-w-[65ch] text-base leading-relaxed text-zinc-600 lg:mx-0 lg:text-lg">
              Choose a project type to calculate an indicative build cost for
              your location and area.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:gap-12">
            {data.map((item, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleEstimator(item.title)}
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{
                  ...rollInView.transition,
                  delay: 0.15 + index * 0.1,
                }}
                className={cn(
                  "group w-full overflow-hidden rounded-md border border-zinc-200/80 bg-white text-left",
                  "transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.1)]",
                  "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                )}
              >
                <div className="relative h-[12rem] w-full overflow-hidden sm:h-[16rem] md:h-[20rem] lg:h-[28rem]">
                  <Image
                    loading="lazy"
                    src={item.images[0].url}
                    width={800}
                    height={560}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-zinc-100 px-4 py-4 lg:px-8 lg:py-6">
                  <span className="text-sm font-medium tracking-wide text-zinc-800 lg:text-lg">
                    {item.title}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white lg:h-11 lg:w-11">
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div id={estimator} className="mx-auto w-full max-w-[1400px]">
          <PriceForm handleBack={handleBack} />
        </div>
      )}
    </Section>
  );
}
