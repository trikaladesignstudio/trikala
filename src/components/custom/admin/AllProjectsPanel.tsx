"use client";

import AdminProjectGrid from "@/components/custom/admin/AdminProjectGrid";
import { AdminProject } from "@/lib/adminUtils";
import { sectionType } from "@/utils/client_utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const sectionOptions = Object.values(sectionType).filter(
  (section) => section !== sectionType.none
);

type AllProjectsPanelProps = {
  projects: AdminProject[];
};

export default function AllProjectsPanel({ projects }: AllProjectsPanelProps) {
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery =
        query.trim().length === 0 ||
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.type.toLowerCase().includes(query.toLowerCase());

      const matchesSection =
        sectionFilter === "all" || project.section === sectionFilter;

      return matchesQuery && matchesSection;
    });
  }, [projects, query, sectionFilter]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="space-y-5"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <span className="sr-only">Search projects</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, description, or category"
            className="w-full rounded-lg border border-admin-border bg-admin-surface text-admin-ink py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-admin-accent/20"
          />
        </label>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="rounded-lg border border-admin-border bg-admin-surface text-admin-ink px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-admin-accent/20"
        >
          <option value="all">All sections</option>
          {sectionOptions.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      <p className="font-geist-mono text-xs uppercase tracking-[0.14em] text-admin-muted">
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
      </p>

      <AdminProjectGrid
        projects={filtered}
        showSection
        emptyTitle="No projects found"
        emptyDescription={
          projects.length === 0
            ? "Create your first project to populate the website."
            : "Try a different search or section filter."
        }
        emptyActionHref={projects.length === 0 ? "/admin/new" : undefined}
        emptyActionLabel={projects.length === 0 ? "Create project" : undefined}
      />
    </motion.section>
  );
}
