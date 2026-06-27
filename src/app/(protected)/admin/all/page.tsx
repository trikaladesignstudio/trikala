import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import AllProjectsPanel from "@/components/custom/admin/AllProjectsPanel";
import { getAdminHeaderStats, getAdminProjects } from "@/lib/adminUtils";

export const revalidate = 0;

export default async function AllPage() {
  const projects = await getAdminProjects();
  const stats = getAdminHeaderStats(projects);

  return (
    <AdminPageShell
      title="All"
      description="Search, filter, and edit every project across the website."
      {...stats}
    >
      <AllProjectsPanel projects={projects} />
    </AdminPageShell>
  );
}
