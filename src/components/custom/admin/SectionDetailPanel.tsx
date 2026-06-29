"use client";

import AdminProjectGrid from "@/components/custom/admin/AdminProjectGrid";
import { AdminProject } from "@/lib/adminUtils";
import { sectionLabels } from "@/lib/adminUtils";
import { sectionType } from "@/utils/client_utils";
import Link from "next/link";

type SectionDetailPanelProps = {
  section: sectionType;
  projects: AdminProject[];
};

export default function SectionDetailPanel({
  section,
  projects,
}: SectionDetailPanelProps) {
  const filtered = projects.filter((p) => p.section === section);
  const label = sectionLabels[section];

  return (
    <div className="space-y-5">
      <div className="flex min-h-[88px] flex-col justify-center gap-3 rounded-2xl border border-admin-border bg-admin-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <p className="text-xs font-geist-mono uppercase tracking-[0.14em] text-admin-muted">
            {section}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-admin-ink">
            {label}
          </h2>
          <p className="mt-1 font-geist-mono text-sm text-admin-muted">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href={`/admin/new?section=${section}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-admin-accent px-4 py-2.5 text-sm font-medium text-white active:scale-[0.98] hover:bg-admin-accent/90"
        >
          Add to section
        </Link>
      </div>

      <AdminProjectGrid
        projects={filtered}
        emptyTitle={`No projects in ${label}`}
        emptyDescription="Add a project assigned to this section to show it on the website."
        emptyActionHref={`/admin/new?section=${section}`}
        emptyActionLabel="Add first project"
      />
    </div>
  );
}
