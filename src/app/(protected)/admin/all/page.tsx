import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import AllProjectsPanel from "@/components/custom/admin/AllProjectsPanel";
import { getAdminProjects } from "@/lib/adminUtils";

export const revalidate = 0;

export default async function AllPage() {
  const projects = await getAdminProjects();

  return (
    <AdminPageShell title="All">
      <AllProjectsPanel projects={projects} />
    </AdminPageShell>
  );
}
