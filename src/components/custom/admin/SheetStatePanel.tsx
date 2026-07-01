"use client";

import { CityRowType, getStateRows } from "@/lib/sheetAccess";
import { locationType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type SheetStatePanelProps = {
  state: locationType;
  defaultExpanded?: boolean;
};

export default function SheetStatePanel({
  state,
  defaultExpanded = false,
}: SheetStatePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [rows, setRows] = useState<CityRowType[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRows = async () => {
    setLoading(true);
    try {
      const data = await getStateRows(state.id);
      setRows(data);
    } catch {
      toast.error("Failed to load cities for this state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      loadRows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, state.id]);

  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
      >
        <div>
          <h3 className="text-base font-semibold text-admin-ink">
            {state.title}
          </h3>
          <p className="mt-0.5 font-geist-mono text-xs text-admin-muted">
            {loading ? "Loading..." : `${rows.length} cities`}
          </p>
        </div>
        <span className="font-geist-mono text-sm text-admin-muted">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="overflow-hidden border-t border-admin-border"
          >
            <div className="divide-y divide-admin-border">
              {rows.map((row) => (
                <div
                  key={`${state.id}-${row.id}`}
                  className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6"
                >
                  <p className="font-medium text-admin-ink">{row.city}</p>
                  <p className="font-geist-mono text-sm text-admin-muted">
                    {row.priceRange}
                  </p>
                </div>
              ))}

              {rows.length === 0 && !loading && (
                <p className="px-5 py-6 text-sm text-admin-muted md:px-6">
                  No cities in this state yet.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
