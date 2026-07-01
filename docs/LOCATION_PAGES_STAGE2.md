# Location Pages — Stage 2 Implementation

Wire the Stage 1 UI to live Google Sheets data, generate one static page per city, and ship full SEO (sitemap, JSON-LD, revalidation).

---

## Stage 1 recap (done)

| Item | Status |
|------|--------|
| UI components (`src/components/location/*`) | Done |
| Page flow: Hero → Services → Pricing → Projects → Process → Closing | Done |
| `/locations` index page | Done — 8 demo cities |
| `/locations/[slug]` city pages | Done — demo data only |
| Footer link to `/locations` | Done |
| Typography / spacing / section rhythm | Done |
| Demo data | `src/lib/locationDemo.ts` (hardcoded) |

**Stage 1 does not:** read Google Sheets, call `generateStaticParams`, update sitemap, pre-fill PriceForm, or emit per-city JSON-LD.

---

## Stage 2 goals

1. **One URL per city** in the pricing Google Sheet (~100–400 pages)
2. **Real pricing** from sheet rows (same source as home price estimator)
3. **Static generation** at build + **ISR** when sheet data changes
4. **SEO:** sitemap entries, canonical URLs, JSON-LD, meta descriptions with live prices
5. **Index page** lists all sheet cities grouped by state
6. **Optional:** keyword CSV generator, alias redirects (Gurugram → Gurgaon)

---

## Architecture

```
Google Sheets (1 tab = state, rows = cities)
        │
        ▼
src/lib/locationPages.ts          ← NEW (replaces demo as source of truth)
  getAllLocations()
  getLocationBySlug(slug)
  getNearbyLocations(stateId, excludeSlug)
  slugifyCity() + alias map
        │
        ├── /locations/page.tsx           → getAllLocations()
        ├── /locations/[slug]/page.tsx    → generateStaticParams + getLocationBySlug
        ├── sitemap.ts                    → append /locations/*
        └── revalidateSite.ts             → /locations + /locations/[slug]

UI (unchanged)                    ← LocationPageData props only
  LocationHero, Services, Pricing, Projects, Process, Closing
```

---

## 1. Data layer

### 1.1 Create `src/lib/locationPages.ts`

Replace `getDemoLocation` / `getAllDemoLocations` calls with sheet-backed functions.

**Extend `LocationPageData`** in `src/lib/locationTypes.ts`:

```ts
export type LocationPageData = {
  slug: string;
  city: string;
  state: string;
  stateId: number;      // sheet tab index — for PriceForm prefill
  cityId: number;       // row index — for get_data_by_location
  priceLow: number;
  priceHigh: number;
  heroImage: string;
  inlineImage: string;
  nearbyCities: NearbyCity[];
  aliases?: string[];   // e.g. ["Gurugram"] for Gurgaon canonical slug
};
```

**Core functions:**

| Function | Purpose |
|----------|---------|
| `slugifyCity(name)` | Lowercase, trim, hyphenate, strip special chars |
| `parsePriceRange(raw)` | Reuse regex from `sheetAccess.ts` → `{ low, high }` |
| `getAllLocations()` | Loop `getStates()` + `getStateRows()`, skip empty cities |
| `getLocationBySlug(slug)` | Lookup + alias resolution |
| `getNearbyLocations(stateId, excludeSlug, limit)` | Same-state siblings for Closing section |
| `groupLocationsByState()` | Move from `locationDemo.ts` or re-export |

**Price parsing** — mirror existing logic in `get_data_by_location`:

```ts
// sheetAccess.ts already does:
const [ilow, ihigh] = interior.match(/\d+/g)!.map(Number);
```

**Nearby cities:** up to 8 other cities from the same state tab, excluding self.

**Hero images:** keep Stage 1 `enrichLocationWithProjects()` — first featured project image, else picsum seed per slug.

### 1.2 City aliases

Static map for SEO duplicates:

```ts
const CITY_ALIASES: Record<string, string> = {
  gurugram: "gurgaon",
  bangalore: "bengaluru", // if needed
};
```

- Canonical slug = first entry in sheet (or preferred spelling)
- Alias slugs → 301 redirect in `next.config.mjs` or middleware

### 1.3 Deprecate demo data

- Keep `locationDemo.ts` only for **vitest fixtures** or delete after migration
- Update imports in both route files

---

## 2. Route changes

### 2.1 `/locations/page.tsx`

```ts
import { getAllLocations, groupLocationsByState } from "@/lib/locationPages";

export const revalidate = 86400; // 24h ISR

export default async function LocationsPage() {
  const locations = await getAllLocations();
  const groups = groupLocationsByState(locations);
  return <LocationIndex groups={groups} totalCount={locations.length} />;
}
```

Remove “Demo set — stage 2” copy from `LocationIndex.tsx`.

### 2.2 `/locations/[slug]/page.tsx`

```ts
export const revalidate = 86400;
export const dynamicParams = true; // new cities after deploy → ISR on first visit

export async function generateStaticParams() {
  const locations = await getAllLocations();
  return locations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const location = await getLocationBySlug(params.slug);
  if (!location) return buildPageMetadata({ title: "Not found", noIndex: true, ... });
  return buildPageMetadata({
    title: `Architects & Interior Designers in ${location.city}`,
    description: locationMetaDescription(location),
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }) {
  const location = await getLocationBySlug(params.slug);
  if (!location) notFound();
  // ... enrich with projects, render same components
}
```

Move `enrichDemoLocation` → `enrichLocationWithProjects` in `locationPages.ts` or keep in page file.

---

## 3. SEO

### 3.1 Sitemap — `src/app/sitemap.ts`

Add:

```ts
import { getAllLocations } from "@/lib/locationPages";

const locationPages = (await getAllLocations()).map((loc) => ({
  url: `${SITE_URL}/locations/${loc.slug}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

// Also add:
{ url: `${SITE_URL}/locations`, priority: 0.8, changeFrequency: "monthly" }

return [...staticPages, ...locationPages, ...projectPages];
```

### 3.2 JSON-LD — `src/lib/seo.ts`

Add helper:

```ts
export function buildLocationJsonLd(location: LocationPageData) {
  return {
    "@context": "https://schema.org",
    "@type": "ArchitecturalService",
    name: SITE_NAME,
    url: `${SITE_URL}/locations/${location.slug}`,
    areaServed: location.city,
    // optional: priceRange if hasPricing
  };
}
```

Inject in `[slug]/page.tsx` via existing `JsonLd` component.

### 3.3 Canonical + OG

Already handled by `buildPageMetadata({ path: `/locations/${slug}` })`.

### 3.4 Keyword CSV (optional, parallel)

Script `scripts/generate-seo-keywords.ts` — one row per city × 8 templates for GSC tracking. Not required for pages to work; useful for marketing ops.

---

## 4. PriceForm pre-fill (optional enhancement)

Stage 1 links to `/#price-estimator` on home. Stage 2 can embed or deep-link with state/city pre-selected.

**PriceForm.tsx** — add optional props:

```ts
initialStateId?: string;
initialCityId?: string;
```

On mount, if provided, set `stateId` / `cityId` and skip user selection.

**LocationPricing.tsx** — either:
- Keep link to home calculator (minimal), or
- Add inline `PriceCalculatorOverlay` + `PriceForm` with `initialStateId={location.stateId}`

---

## 5. Revalidation

### 5.1 When sheet pricing changes

In `src/lib/sheetAccess.ts`, after admin row updates (`revalidatePath("/admin")`), also:

```ts
revalidatePath("/locations", "page");
revalidatePath("/locations/[slug]", "page"); // layout-level if supported
revalidatePath("/sitemap.xml");
```

Or use `revalidateTag("locations")` if migrating to tagged cache:

```ts
// locationPages.ts
export async function getAllLocations() {
  "use cache";
  // tag: "locations"
}
```

### 5.2 `revalidateSite.ts`

Add `/locations` to `MAIN_LAYOUT_ROUTES` if footer should refresh when contact data changes (already has Locations link).

---

## 6. Redirects

`next.config.mjs`:

```js
async redirects() {
  return [
    { source: "/locations/gurugram", destination: "/locations/gurgaon", permanent: true },
    // generate from CITY_ALIASES map
  ];
}
```

---

## 7. Build & deploy

| Requirement | Detail |
|-------------|--------|
| Env vars | Same as price estimator: `GOOGLE_SHEET_ID`, service account keys |
| Build time | Grows with city count; 200–400 pages is fine on Vercel |
| CI | Must have sheet creds in Vercel env for production build |
| First deploy | Run build locally with creds to verify page count |
| New city in sheet | Appears after rebuild, or on first visit if `dynamicParams: true` |

**Log on build:**

```ts
console.log(`[locations] Generated ${locations.length} city pages`);
```

---

## 8. File checklist

| Action | File |
|--------|------|
| **Create** | `src/lib/locationPages.ts` |
| **Create** | `src/lib/locationPages.test.ts` |
| **Update** | `src/lib/locationTypes.ts` — add `stateId`, `cityId` |
| **Update** | `src/app/(main)/(subpages)/locations/page.tsx` |
| **Update** | `src/app/(main)/(subpages)/locations/[slug]/page.tsx` |
| **Update** | `src/app/sitemap.ts` |
| **Update** | `src/lib/revalidateSite.ts` |
| **Update** | `src/lib/sheetAccess.ts` — revalidate location paths |
| **Update** | `src/lib/seo.ts` — `buildLocationJsonLd` |
| **Update** | `src/components/location/LocationIndex.tsx` — remove demo note |
| **Update** | `next.config.mjs` — alias redirects |
| **Optional** | `src/components/custom/PriceForm.tsx` — prefill props |
| **Optional** | `scripts/generate-seo-keywords.ts` |
| **Remove/keep** | `src/lib/locationDemo.ts` — fixtures only or delete |

**Do not change** (unless bugfix): `LocationHero`, `LocationServices`, `LocationProjects`, `LocationProcess`, `LocationClosing`, `locationStyles.ts`, `locationCopy.ts`.

---

## 9. Testing

### Unit tests (`locationPages.test.ts`)

- `slugifyCity("New Delhi")` → `"new-delhi"`
- `parsePriceRange("850 - 1,450")` → `{ low: 850, high: 1450 }`
- Alias: `getLocationBySlug("gurugram")` resolves to Gurgaon or returns null (redirect handles)
- Dedup: two rows same slug → keep first, log warning

### Manual smoke (3 GSC cities)

| URL | Check |
|-----|-------|
| `/locations/gurgaon` | Real Haryana pricing, hero image, WhatsApp CTA |
| `/locations/aligarh` | Uttar Pradesh pricing |
| `/locations/karnal` | Nearby links include other Haryana cities |
| `/locations` | Full city list matches sheet row count |
| `/sitemap.xml` | Contains all `/locations/*` URLs |
| View source | JSON-LD `areaServed: "Gurgaon"` |

### Build verify

```bash
pnpm build
# Expect: [locations] Generated N city pages
# No Google Sheets auth errors
```

---

## 10. Implementation order

1. `locationPages.ts` + tests (slug, price parse, getAllLocations)
2. Swap `/locations` index to sheet data
3. Add `generateStaticParams` + swap `[slug]` page
4. Sitemap + JSON-LD
5. Revalidation hooks in sheetAccess
6. Alias redirects
7. Remove demo copy; optional PriceForm prefill
8. Production build + spot-check
9. (Optional) keyword CSV script

**Estimated effort:** 1–2 days for core wiring; +half day for SEO extras and prefill.

---

## 11. Out of scope (Stage 3+)

- Separate URLs per service (`/interior-designers-in-gurgaon`)
- Project `city` field in MongoDB for city-specific portfolio
- FAQ section per city
- State-only landing pages (`/locations/haryana`)
- Google Ads API integration

---

## 12. Success criteria

- [ ] Every non-empty city row in Google Sheet has a live `/locations/{slug}` page
- [ ] Pricing on page matches sheet row for that city
- [ ] `/locations` lists all cities grouped by state
- [ ] Sitemap includes all location URLs
- [ ] Pages are statically generated (fast TTFB, indexable)
- [ ] Sheet admin updates refresh pricing within ISR window or on revalidate
- [ ] No “stage 2” / demo placeholder copy remains
