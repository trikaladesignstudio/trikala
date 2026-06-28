import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import ProjectForm from "@/components/custom/ProjectForm";
import { Suspense } from "react";

export default async function CreateProject() {
  return (
    <AdminPageShell title="New project">
      <Suspense fallback={<div className="text-admin-muted">Loading form...</div>}>
        <ProjectForm projectId={undefined} />
      </Suspense>
    </AdminPageShell>
  );
}
