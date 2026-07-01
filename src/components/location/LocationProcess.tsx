"use client";

import Heading from "@/components/custom/Heading";
import { locationProcessSteps } from "@/lib/locationCopy";
import {
  locationBodyClass,
  locationHeadingClass,
  locationLabelClass,
  locationSectionInk,
  locationSectionPad,
  locationSectionScrollMt,
} from "@/components/location/locationStyles";
import { cn, rollInView } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

export default function LocationProcess() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="process"
      className={cn(locationSectionInk, locationSectionScrollMt)}
    >
      <div
        className={cn(
          locationSectionPad,
          "mx-auto flex max-w-[1400px] flex-col gap-10 lg:gap-12",
        )}
      >
        <div className="flex flex-col gap-3 lg:max-w-[50%]">
          <Heading
            className="text-left text-3xl text-white md:text-5xl lg:text-6xl"
            text="How we work"
          />
          <p className={cn(locationBodyClass, "text-zinc-300")}>
            A clear path from first sketch to finished interiors — managed
            in-house at Trikala Architects.
          </p>
        </div>

        <div
          className={cn(
            "relative flex gap-4 overflow-x-auto pb-2",
            "snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:snap-none [&::-webkit-scrollbar]:hidden",
          )}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black to-transparent md:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black to-transparent md:hidden"
            aria-hidden
          />

          {locationProcessSteps.map((item, index) => (
            <motion.div
              key={item.step}
              variants={rollInView}
              viewport={{ once: true }}
              initial="base"
              whileInView="show"
              transition={{
                ...rollInView.transition,
                delay: 0.08 + index * 0.08,
              }}
              className="min-w-[14rem] shrink-0 snap-start pl-5 md:min-w-0"
            >
              <motion.div
                className="border-l-2 border-custom-lb pl-5"
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: [0.7, 1, 0.7] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.4,
                      }
                }
              >
                <span className={cn(locationLabelClass, "text-zinc-400")}>
                  {item.step}
                </span>
                <h3
                  className={cn(
                    locationHeadingClass,
                    "mt-2 text-xl text-white md:text-2xl",
                  )}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
