import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import PdfProjectsPanel from "@/components/custom/admin/PdfProjectsPanel";
import { getAdminProjects } from "@/lib/adminUtils";

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <AdminPageShell title="Showcase">
      <PdfProjectsPanel projects={projects} />
    </AdminPageShell>
  );
}
