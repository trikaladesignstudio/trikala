import AdminLayoutClient from "@/components/custom/admin/AdminLayoutClient";
import {
  buildSectionCounts,
  filterProjectsWithPdf,
  getAdminProjects,
} from "@/lib/adminUtils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getAdminProjects();
  const sectionCounts = buildSectionCounts(projects);
  const totalCount = projects.length;
  const pdfCount = filterProjectsWithPdf(projects).length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const sidebarProps = { sectionCounts, totalCount, pdfCount, featuredCount };

  return (
    <AdminLayoutClient
      sidebarProps={sidebarProps}
      className={`${GeistSans.variable} ${GeistMono.variable} h-[100dvh] overflow-hidden bg-admin-canvas font-geist text-admin-ink`}
    >
      {children}
    </AdminLayoutClient>
  );
}
