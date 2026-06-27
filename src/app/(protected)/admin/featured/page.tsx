import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import FeaturedProjectsPanel from "@/components/custom/admin/FeaturedProjectsPanel";
import { getAdminHeaderStats, getAdminProjects } from "@/lib/adminUtils";

export const revalidate = 0;

export default async function FeaturedPage() {
  const projects = await getAdminProjects();
  const stats = getAdminHeaderStats(projects);

  return (
    <AdminPageShell
      title="Featured"
      description="Projects marked with the featured label appear in the highlighted work section on the homepage."
      {...stats}
    >
      <FeaturedProjectsPanel projects={projects} />
    </AdminPageShell>
  );
}
