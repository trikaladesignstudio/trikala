"use client";

import AdminProjectGrid from "@/components/custom/admin/AdminProjectGrid";
import { AdminProject, filterProjectsWithPdf } from "@/lib/adminUtils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type PdfProjectsPanelProps = {
  projects: AdminProject[];
};

export default function PdfProjectsPanel({ projects }: PdfProjectsPanelProps) {
  const [query, setQuery] = useState("");
  const pdfProjects = useMemo(() => filterProjectsWithPdf(projects), [projects]);

  const filtered = useMemo(() => {
    return pdfProjects.filter((project) => {
      if (query.trim().length === 0) return true;

      const normalized = query.toLowerCase();
      return (
        project.title.toLowerCase().includes(normalized) ||
        project.description.toLowerCase().includes(normalized) ||
        project.type.toLowerCase().includes(normalized)
      );
    });
  }, [pdfProjects, query]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="space-y-5"
    >
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

      <p className="font-geist-mono text-xs uppercase tracking-[0.14em] text-admin-muted">
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
      </p>

      <AdminProjectGrid
        projects={filtered}
        showSection
        emptyTitle="No projects with PDFs"
        emptyDescription={
          pdfProjects.length === 0
            ? "Upload a PDF when editing a project to list it here."
            : "Try a different search term."
        }
        emptyActionHref={pdfProjects.length === 0 ? "/admin/all" : undefined}
        emptyActionLabel={pdfProjects.length === 0 ? "View all projects" : undefined}
      />
    </motion.section>
  );
}
