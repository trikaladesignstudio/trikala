import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import FeaturedProjectsPanel from "@/components/custom/admin/FeaturedProjectsPanel";
import { getAdminProjects } from "@/lib/adminUtils";

export const revalidate = 0;

export default async function FeaturedPage() {
  const projects = await getAdminProjects();

  return (
    <AdminPageShell title="Featured">
      <FeaturedProjectsPanel projects={projects} />
    </AdminPageShell>
  );
}
