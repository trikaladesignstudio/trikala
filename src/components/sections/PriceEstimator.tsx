"use client";

import { cn, rollInView } from "@/lib/utils";
import { filterAllProjects } from "@/utils/dbActions";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Heading from "../custom/Heading";
import PriceCalculatorOverlay from "../custom/PriceCalculatorOverlay";
import PriceForm from "../custom/PriceForm";
import Section from "../custom/Section";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function PriceEstimator({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const [selectedProject, setSelectedProject] = useState<
    (typeof data)[number] | null
  >(null);

  const handleBack = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <Section
        id="price-estimator"
        className="justify-start gap-4 bg-zinc-50/80 py-6 lg:justify-center lg:gap-4 lg:py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 lg:gap-12"
        >
          <div className="flex flex-col gap-2 lg:max-w-[62%] lg:gap-4">
            <Heading
              className="text-left text-3xl md:text-5xl lg:text-7xl"
              text="Price Estimator"
            />
            <p className="max-w-[65ch] text-base leading-relaxed text-zinc-600 lg:text-lg">
              Choose a project type to calculate an indicative build cost for
              your location and area.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:gap-10">
            {data.map((item, index) => (
              <motion.button
                key={item.id ?? index}
                type="button"
                onClick={() => setSelectedProject(item)}
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{
                  ...rollInView.transition,
                  delay: 0.15 + index * 0.1,
                }}
                className={cn(
                  "group w-full overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white text-left",
                  "transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.1)]",
                  "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-lb/30"
                )}
              >
                <div className="relative h-[7rem] w-full overflow-hidden sm:h-[10rem] md:h-[20rem] lg:h-[24rem]">
                  <Image
                    loading="lazy"
                    src={item.images[0].url}
                    width={800}
                    height={560}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-zinc-100 px-4 py-3 lg:px-8 lg:py-6">
                  <span className="text-sm font-medium tracking-wide text-zinc-800 lg:text-lg">
                    {item.title}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all group-hover:border-custom-lb group-hover:bg-custom-lb group-hover:text-white lg:h-11 lg:w-11">
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </Section>

      <PriceCalculatorOverlay
        open={selectedProject !== null}
        projectType={selectedProject?.title ?? ""}
        projectImage={selectedProject?.images[0]?.url}
        onClose={handleBack}
      >
        {selectedProject ? (
          <PriceForm projectType={selectedProject.title} />
        ) : null}
      </PriceCalculatorOverlay>
    </>
  );
}
