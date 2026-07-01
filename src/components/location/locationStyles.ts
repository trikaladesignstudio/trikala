/** Public location page typography — matches DESIGN.md */

export const locationLabelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-zinc-500";

/** Silver Queen — headings only (h1–h3) */
export const locationHeadingClass =
  "font-silver tracking-tight text-zinc-900";

/** Emphasized non-heading text — normal body font */
export const locationEmphasisClass = "font-medium text-zinc-900";

export const locationHeadlineClass =
  "text-[clamp(2rem,5vw,3.75rem)] leading-[1.1]";

export const locationBodyClass =
  "max-w-[65ch] text-base leading-relaxed text-zinc-600";

/** Larger body copy for service rows and section intros */
export const locationBodyLargeClass =
  "max-w-[65ch] text-base leading-relaxed text-zinc-700 md:text-lg md:leading-relaxed";

export const locationPriceClass = "font-medium tabular-nums text-zinc-900";

export const locationFocusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-lb";

/** Section surfaces — canvas / surface / ink rhythm */
export const locationSectionCanvas = "w-full bg-custom-canvas";
export const locationSectionSurface = "w-full bg-white";
export const locationSectionInk = "w-full bg-black";
export const locationSectionPad = "page-x py-14 lg:py-20";
export const locationSectionPadCompact = "page-x py-10 lg:py-14";

/** Scroll offset for sticky section nav below NavBar */
export const locationSectionScrollMt = "scroll-mt-24";

export const locationPrimaryBtn = [
  "inline-flex h-11 min-h-[44px] items-center gap-2.5 rounded-md px-5",
  "bg-custom-lb text-sm font-medium tracking-tight text-white",
  "transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:bg-custom-lb/90 active:scale-[0.98]",
  locationFocusRing,
].join(" ");

export const locationGhostBtn = [
  "inline-flex h-11 min-h-[44px] items-center gap-2 rounded-md border border-zinc-300/80 px-5",
  "text-sm font-medium tracking-tight text-zinc-800",
  "transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:border-zinc-400 hover:bg-white active:scale-[0.98]",
  locationFocusRing,
].join(" ");
