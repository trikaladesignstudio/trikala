"use client";

import Heading from "@/components/custom/Heading";
import Masonry, { type MasonryItem } from "@/components/custom/Masonry/Masonry";
import { cn } from "@/lib/utils";
import { allProjectTypes } from "@/utils/client_utils";
import { Prisma } from "@prisma/client";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

const filterTypes = Object.values(allProjectTypes).filter(
  (type) => type !== "none"
);

const MASONRY_HEIGHTS = [1280, 1040, 1160, 920, 1240, 1080, 1120, 980];

function isValidImageUrl(url?: string | null) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    if (/\.(webp|jpg|jpeg|png|gif|avif|svg)(\?|$)/i.test(parsed.pathname)) {
      return true;
    }
    return (
      parsed.hostname.includes("utfs.io") ||
      parsed.hostname.includes("uploadthing") ||
      parsed.hostname.includes("ufs.sh")
    );
  } catch {
    return false;
  }
}

function toMasonryItems(
  projects: Prisma.ProjectCreateInput[]
): MasonryItem[] {
  return projects.map((project, index) => {
    const images = Array.isArray(project.images) ? project.images : [];
    const coverUrl = images[0]?.url;
    const typeLabel =
      project.type && project.type !== "none"
        ? project.type.replace(" Design", "")
        : null;

    return {
      id: String(project.id),
      img: isValidImageUrl(coverUrl) ? coverUrl : undefined,
      url: `/projects/${project.id}`,
      height: MASONRY_HEIGHTS[index % MASONRY_HEIGHTS.length],
      title: project.title ?? undefined,
      typeLabel,
    };
  });
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

  const masonryItems = useMemo(
    () => toMasonryItems(filteredProjects),
    [filteredProjects]
  );

  const countLabel = useMemo(() => {
    const count = filteredProjects.length;
    const noun = count === 1 ? "project" : "projects";
    if (activeType === "All") return `${count} ${noun}`;
    return `${count} ${noun} in ${activeType.replace(" Design", "")}`;
  }, [filteredProjects.length, activeType]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-10 lg:gap-14">
        <header className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-x-16">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Heading
              className="text-left text-zinc-900"
              text="Projects"
              customDelay={0.1}
              startVisible
            />
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-600 lg:text-base">
              Selected architecture, interior, and landscape work from across
              India.
            </p>
            <div className="h-px w-12 bg-custom-lb" />
          </div>
        </header>

        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="h-px w-16 bg-zinc-300" />
          <p className="font-silver text-2xl tracking-tight text-zinc-900">
            No projects yet
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
            Our portfolio is being curated. Check back soon for new work.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 lg:gap-6">
      <header className="grid grid-cols-1 gap-5 border-b border-zinc-200/80 pb-5 lg:grid-cols-12 lg:gap-x-12 lg:pb-6">
        <div className="flex flex-col gap-2.5 lg:col-span-7">
          <Heading
            className="text-left text-zinc-900"
            text="Projects"
            customDelay={0.1}
            startVisible
          />
          <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-600 lg:text-base">
            Selected architecture, interior, and landscape work from across
            India.
          </p>
          <div className="h-px w-12 bg-custom-lb" />
        </div>

        <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end lg:justify-end">
          <div className="-mx-[var(--page-gutter)] flex gap-2 overflow-x-auto px-[var(--page-gutter)] pb-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0">
            {["All", ...filterTypes].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 active:scale-[0.98] lg:text-sm",
                  activeType === type
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300/80 bg-white text-zinc-600 hover:border-zinc-400"
                )}
              >
                {type === "All" ? "All Work" : type.replace(" Design", "")}
              </button>
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400 lg:text-right">
            {countLabel}
          </p>
        </div>
      </header>

      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <p className="text-sm text-zinc-500">
            No projects in this category yet.
          </p>
          <button
            type="button"
            onClick={() => setActiveType("All")}
            className="text-sm font-medium text-zinc-900 underline underline-offset-4 transition-opacity hover:opacity-70 active:scale-[0.98]"
          >
            View all work
          </button>
        </motion.div>
      ) : (
        <Masonry
          key={activeType}
          items={masonryItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.97}
          blurToFocus
          colorShiftOnHover={false}
        />
      )}
    </div>
  );
};

export default ProjectShowClient;
