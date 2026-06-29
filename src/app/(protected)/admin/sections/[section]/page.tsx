import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import SectionDetailPanel from "@/components/custom/admin/SectionDetailPanel";
import { getAdminProjects, sectionLabels } from "@/lib/adminUtils";
import { sectionType } from "@/utils/client_utils";
import { notFound } from "next/navigation";

export const revalidate = 0;

function isValidSection(value: string): value is sectionType {
  return Object.values(sectionType).includes(value as sectionType);
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const sectionParam = (await params).section;

  if (!isValidSection(sectionParam) || sectionParam === sectionType.none) {
    notFound();
  }

  const projects = await getAdminProjects();
  const label = sectionLabels[sectionParam];

  return (
    <AdminPageShell title={label}>
      <SectionDetailPanel section={sectionParam} projects={projects} />
    </AdminPageShell>
  );
}
