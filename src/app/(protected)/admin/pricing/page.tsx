import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import SheetEditNotice from "@/components/custom/admin/SheetEditNotice";
import SheetManager from "@/components/custom/admin/SheetManager";
import { getAdminHeaderStats, getAdminProjects } from "@/lib/adminUtils";
import { getGoogleSheetUrl, getStates } from "@/lib/sheetAccess";

export const revalidate = 0;

export default async function PricingPage() {
  const [projects, states] = await Promise.all([
    getAdminProjects(),
    getStates().catch(() => []),
  ]);
  const stats = getAdminHeaderStats(projects);
  const sheetUrl = getGoogleSheetUrl();

  return (
    <AdminPageShell
      title="Pricing data"
      description="Read-only preview of location-based estimator rates from Google Sheets."
      {...stats}
      fullWidth
      action={{
        href: sheetUrl,
        label: "Open Google Sheet",
        external: true,
      }}
    >
      <div className="space-y-6">
        <SheetEditNotice />
        <SheetManager states={states} />
      </div>
    </AdminPageShell>
  );
}
