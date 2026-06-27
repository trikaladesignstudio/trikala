"use client";

import AdminProjectCard from "@/components/custom/admin/AdminProjectCard";
import { AdminProject } from "@/lib/adminUtils";
import Link from "next/link";
import { motion } from "framer-motion";

type AdminProjectGridProps = {
  projects: AdminProject[];
  showSection?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
};

export default function AdminProjectGrid({
  projects,
  showSection = false,
  emptyTitle = "No projects found",
  emptyDescription = "Nothing to show here yet.",
  emptyActionHref,
  emptyActionLabel,
}: AdminProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border bg-admin-surface px-6 py-12 text-center">
        <p className="text-sm font-medium text-admin-ink">{emptyTitle}</p>
        <p className="mt-1 max-w-sm text-sm text-admin-muted">{emptyDescription}</p>
        {emptyActionHref && emptyActionLabel && (
          <Link
            href={emptyActionHref}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-lg border border-admin-accent px-4 py-2 text-sm font-medium text-admin-accent hover:bg-admin-accent/5"
          >
            {emptyActionLabel}
          </Link>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: index * 0.04,
          }}
        >
          <AdminProjectCard project={project} showSection={showSection} />
        </motion.div>
      ))}
    </motion.div>
  );
}
