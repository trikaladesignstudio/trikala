"use client";

import Heading from "@/components/custom/Heading";
import {
  locationBodyClass,
  locationEmphasisClass,
  locationHeadingClass,
  locationFocusRing,
  locationPrimaryBtn,
  locationSectionPad,
  locationSectionScrollMt,
  locationSectionSurface,
} from "@/components/location/locationStyles";
import type { LocationProject } from "@/lib/locationTypes";
import { cn, rollInView } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type LocationProjectsProps = {
  projects: LocationProject[];
};

export default function LocationProjects({ projects }: LocationProjectsProps) {
  return (
    <section
      id="projects"
      className={cn(locationSectionSurface, locationSectionScrollMt)}
    >
      <div
        className={cn(
          locationSectionPad,
          "mx-auto flex max-w-[1400px] flex-col gap-8 lg:gap-12",
        )}
      >
        <div className="flex flex-col gap-3 lg:max-w-[65ch]">
          <Heading
            className="text-left text-3xl md:text-5xl lg:text-6xl"
            text="Recent work"
          />
          <p className={locationBodyClass}>
            Selected projects by Trikala Architects — residential, commercial,
            and interior work across India.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-start gap-6 rounded-[2rem] border border-zinc-200/80 bg-white px-8 py-12 md:flex-row md:items-center md:justify-between md:px-12">
            <div className="flex max-w-md flex-col gap-2">
              <h3 className={cn(locationHeadingClass, "text-2xl")}>
                Portfolio coming soon
              </h3>
              <p className={locationBodyClass}>
                Browse our full project archive for residential, commercial, and
                interior work across India.
              </p>
            </div>
            <Link href="/projects" className={cn(locationPrimaryBtn, "shrink-0")}>
              View all projects
              <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{
                  ...rollInView.transition,
                  delay: 0.1 + index * 0.08,
                }}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className={cn(
                    "group block overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white",
                    "transition-all duration-300 hover:border-zinc-300",
                    "hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.1)] active:scale-[0.99]",
                    locationFocusRing,
                  )}
                >
                  <div className="relative h-[12rem] w-full overflow-hidden sm:h-[14rem] md:h-[18rem]">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-zinc-100 px-5 py-4 md:px-6 md:py-5">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span
                        className={cn(
                          locationEmphasisClass,
                          "truncate text-base md:text-lg",
                        )}
                      >
                        {project.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {project.type}
                      </span>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all group-hover:border-custom-lb group-hover:bg-custom-lb group-hover:text-white">
                      <ArrowRightIcon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {projects.length > 0 ? (
          <Link
            href="/projects"
            className={cn(
              "inline-flex w-fit items-center gap-2 text-sm font-medium text-custom-lb underline-offset-4 hover:underline",
              locationFocusRing,
            )}
          >
            View all projects
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
