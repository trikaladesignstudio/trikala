"use client";

import SheetStatePanel from "@/components/custom/admin/SheetStatePanel";
import { locationType } from "@/types";

type SheetManagerProps = {
  states: locationType[];
};

export default function SheetManager({ states }: SheetManagerProps) {
  return (
    <div className="space-y-4">
      {states.length === 0 && (
        <div className="rounded-2xl border border-dashed border-admin-border bg-admin-surface px-6 py-10 text-center">
          <p className="text-sm text-admin-muted">
            No pricing states found in the sheet. Add state tabs in Google
            Sheets to see them here.
          </p>
        </div>
      )}

      {states.map((state, index) => (
        <SheetStatePanel
          key={`${state.id}-${state.title}`}
          state={state}
          defaultExpanded={index === 0}
        />
      ))}
    </div>
  );
}
