import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import ProjectForm from "@/components/custom/ProjectForm";
import { getAdminHeaderStats, getAdminProjects } from "@/lib/adminUtils";
import { Suspense } from "react";

export default async function CreateProject() {
  const projects = await getAdminProjects();
  const stats = getAdminHeaderStats(projects);

  return (
    <AdminPageShell
      title="New project"
      description="Assign a section, upload media, and publish content to the live website."
      {...stats}
    >
      <Suspense fallback={<div className="text-admin-muted">Loading form...</div>}>
        <ProjectForm projectId={undefined} />
      </Suspense>
    </AdminPageShell>
  );
}
