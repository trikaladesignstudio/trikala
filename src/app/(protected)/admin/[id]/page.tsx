import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import ProjectForm from "@/components/custom/ProjectForm";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <AdminPageShell title="Edit project">
      <Suspense fallback={<div className="text-admin-muted">Loading form...</div>}>
        <ProjectForm projectId={id} />
      </Suspense>
    </AdminPageShell>
  );
}
