"use client";

import { FormattedText } from "@/components/custom/FormattedText";
import { cn } from "@/lib/utils";
import { allProjectTypes } from "@/utils/client_utils";
import { Prisma } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

const filterTypes = Object.values(allProjectTypes).filter(
  (type) => type !== "none"
);

function getGridSpan(index: number) {
  return index % 3 === 0 ? "md:col-span-2" : "";
}

function getAspect(index: number) {
  if (index % 3 === 0) return "aspect-[3/2] md:aspect-[21/9]";
  return index % 2 === 0 ? "aspect-[4/3]" : "aspect-[4/5] md:aspect-[4/5]";
}

const ProjectShowClient = ({
  projects,
}: {
  projects: Prisma.ProjectCreateInput[];
}) => {
  const [activeType, setActiveType] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    if (activeType === "All") return projects;
    return projects.filter((project) => project.type === activeType);
  }, [projects, activeType]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-px w-16 bg-zinc-300" />
        <p className="font-silver text-2xl tracking-tight text-zinc-900">
          No projects yet
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
          Our portfolio is being curated. Check back soon for new work.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10 lg:gap-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-zinc-500 lg:text-base">
          Selected architecture, interior, and landscape work from across India.
        </p>
        <div className="flex flex-wrap gap-2">
          {["All", ...filterTypes].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 active:scale-[0.98] lg:text-sm",
                activeType === type
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
              )}
            >
              {type === "All" ? "All Work" : type.replace(" Design", "")}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-zinc-500">
            No projects in this category yet.
          </p>
          <button
            type="button"
            onClick={() => setActiveType("All")}
            className="text-sm font-medium text-zinc-900 underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            View all work
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {filteredProjects.map((project, index) => {
            const images = Array.isArray(project.images) ? project.images : [];
            const coverUrl = images[0]?.url;
            const typeLabel =
              project.type && project.type !== "none"
                ? project.type.replace(" Design", "")
                : null;

            return (
              <motion.article
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: spring,
                  },
                }}
                className={cn("group flex flex-col gap-5", getGridSpan(index))}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="group/link relative block"
                  aria-label={`View project: ${project.title}`}
                >
                  <div className="overflow-hidden rounded-2xl bg-zinc-100">
                  <div
                    className={cn(
                      "relative w-full overflow-hidden",
                      getAspect(index)
                    )}
                  >
                    {coverUrl ? (
                      <Image
                        loading={index < 3 ? "eager" : "lazy"}
                        src={coverUrl}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt={project.title ?? "Project image"}
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full min-h-[10rem] items-center justify-center bg-zinc-100 md:min-h-[14rem]">
                        <span className="text-sm text-zinc-400">No preview</span>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/link:opacity-100" />
                  </div>
                  </div>
                </Link>

                <div className="flex items-start justify-between gap-4 px-0.5">
                  <div className="min-w-0 flex-1">
                    <Link href={`/projects/${project.id}`}>
                      <h2 className="truncate font-medium capitalize text-zinc-900 transition-colors group-hover:text-zinc-600">
                        {project.title}
                      </h2>
                    </Link>
                    {project.description && (
                      <FormattedText className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                        {project.description}
                      </FormattedText>
                    )}
                  </div>
                  {typeLabel && (
                    <span className="shrink-0 text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                      {typeLabel}
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      )}

      <p className="text-xs tracking-wide text-zinc-400">
        {filteredProjects.length}{" "}
        {filteredProjects.length === 1 ? "project" : "projects"}
        {activeType !== "All" && ` in ${activeType.replace(" Design", "")}`}
      </p>
    </div>
  );
};

export default ProjectShowClient;
