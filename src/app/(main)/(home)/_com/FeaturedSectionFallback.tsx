import FeaturedMenu from "@/components/custom/FeaturedMenu";
import { FALLBACK_MENU_ITEMS } from "@/lib/heroFeaturedUtils";

export default function FeaturedSectionFallback() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <FeaturedMenu items={FALLBACK_MENU_ITEMS} loading />
    </div>
  );
}
