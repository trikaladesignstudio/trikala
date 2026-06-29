"use client";

import AdminProjectGrid from "@/components/custom/admin/AdminProjectGrid";
import { AdminProject } from "@/lib/adminUtils";

type FeaturedProjectsPanelProps = {
  projects: AdminProject[];
};

export default function FeaturedProjectsPanel({
  projects,
}: FeaturedProjectsPanelProps) {
  const featured = projects.filter((p) => p.featured);

  return (
    <AdminProjectGrid
      projects={featured}
      emptyTitle="No featured projects"
      emptyDescription="Mark projects as featured when editing, or browse all projects."
      emptyActionHref="/admin/all"
      emptyActionLabel="View all projects"
    />
  );
}
