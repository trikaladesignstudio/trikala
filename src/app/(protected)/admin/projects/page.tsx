import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import PdfProjectsPanel from "@/components/custom/admin/PdfProjectsPanel";
import { getAdminHeaderStats, getAdminProjects } from "@/lib/adminUtils";

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getAdminProjects();
  const stats = getAdminHeaderStats(projects);

  return (
    <AdminPageShell
      title="Projects"
      description="Portfolio projects with uploaded PDF files shown on the public projects page."
      {...stats}
    >
      <PdfProjectsPanel projects={projects} />
    </AdminPageShell>
  );
}
