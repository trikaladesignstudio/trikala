import AdminPageShell from "@/components/custom/admin/AdminPageShell";
import SheetEditNotice from "@/components/custom/admin/SheetEditNotice";
import SheetManager from "@/components/custom/admin/SheetManager";
import { getGoogleSheetUrl, getStates } from "@/lib/sheetAccess";

export const revalidate = 0;

export default async function PricingPage() {
  const states = await getStates().catch(() => []);
  const sheetUrl = getGoogleSheetUrl();

  return (
    <AdminPageShell
      title="Pricing data"
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
