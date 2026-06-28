import { featuredSectionLabelClassName } from "@/lib/featuredSectionStyles";

/** Suspense fallback — mirrors Featured Work section shell while data loads */
export default function FeaturedSectionFallback() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden lg:block">
      <p className={featuredSectionLabelClassName}>Featured Work</p>
      <div className="relative min-h-0 flex-1" aria-hidden />
    </div>
  );
}
