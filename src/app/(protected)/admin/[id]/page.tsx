import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import ProjectForm from "@/components/custom/ProjectForm";
import { getAdminHeaderStats, getAdminProjects } from "@/lib/adminUtils";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const projects = await getAdminProjects();
  const stats = getAdminHeaderStats(projects);

  return (
    <AdminPageShell
      title="Edit project"
      description="Update section assignment, copy, and media for this website entry."
      {...stats}
    >
      <Suspense fallback={<div className="text-admin-muted">Loading form...</div>}>
        <ProjectForm projectId={id} />
      </Suspense>
    </AdminPageShell>
  );
}
