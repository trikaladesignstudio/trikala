export default function SheetEditNotice() {
  return (
    <div className="w-full rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-4 dark:border-amber-900/60 dark:bg-amber-950/40 md:px-6 md:py-5">
      <p className="text-base font-medium text-amber-950 dark:text-amber-100">
        Instructions
      </p>
      <p className="mt-2 text-sm leading-relaxed text-amber-900 dark:text-amber-200/90 md:text-base">
        To edit pricing, update the Google Sheet directly. This page is a
        read-only preview — changes in the sheet sync to the live price
        estimator.
      </p>
    </div>
  );
}
