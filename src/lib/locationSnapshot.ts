import { GoogleAuth } from "google-auth-library";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

import {
  getBlockedSheetTabs,
  getGoogleServiceAccountCredentials,
  getGoogleSheetId,
} from "./googleSheetsConfig";
import type { LocationPageData } from "./locationTypes";
import {
  cellValue,
  cityHeader,
  parsePriceRange,
  priceHeader,
  slugifyCity,
} from "./sheetRowUtils";

export const SNAPSHOT_PATH = join(process.cwd(), "src/generated/locations.json");

type SheetInput = {
  stateId: number;
  title: string;
  values: string[][];
};

function nearbyFromState(
  stateLocations: LocationPageData[],
  excludeSlug: string,
  limit = 8,
): LocationPageData["nearbyCities"] {
  return stateLocations
    .filter((loc) => loc.slug !== excludeSlug)
    .slice(0, limit)
    .map(({ slug, city }) => ({ slug, city }));
}

function getCityHeader(headers: string[]) {
  return cityHeader(headers);
}

function getPriceHeader(headers: string[]) {
  return priceHeader(headers);
}

function getCell(
  row: string[],
  headers: string[],
  header: string,
  fallbackIndex: number,
) {
  return cellValue(row, headers, header, fallbackIndex);
}

export function buildLocationsFromSheetValues(
  sheets: SheetInput[],
): LocationPageData[] {
  const locations: LocationPageData[] = [];
  const seenSlugs = new Set<string>();

  for (const { stateId, title, values } of sheets) {
    if (values.length === 0) continue;

    const headers = values[0] ?? [];
    const cityHeader = getCityHeader(headers);
    const priceHeader = getPriceHeader(headers);

    const stateLocations: LocationPageData[] = [];

    for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
      const row = values[rowIndex] ?? [];
      const city = getCell(row, headers, cityHeader, 0).trim();
      if (!city) continue;

      const slug = slugifyCity(city);
      if (seenSlugs.has(slug)) {
        console.warn(
          `[locations] Duplicate slug "${slug}" for city "${city}", skipping`,
        );
        continue;
      }
      seenSlugs.add(slug);

      const { low, high } = parsePriceRange(
        getCell(row, headers, priceHeader, headers.length > 2 ? 2 : 1),
      );

      stateLocations.push({
        slug,
        city,
        state: title,
        stateId,
        cityId: rowIndex - 1,
        priceLow: low,
        priceHigh: high,
        heroImage: "/static/logo.webp",
        inlineImage: "/static/logo.webp",
        nearbyCities: [],
      });
    }

    for (const loc of stateLocations) {
      loc.nearbyCities = nearbyFromState(stateLocations, loc.slug);
    }

    locations.push(...stateLocations);
  }

  return locations.sort((a, b) => {
    const stateCompare = a.state.localeCompare(b.state);
    if (stateCompare !== 0) return stateCompare;
    return a.city.localeCompare(b.city);
  });
}

/** Two Sheets API calls: metadata + batchGet for all state tabs. */
export async function fetchLocationsFromSheets(): Promise<LocationPageData[]> {
  const auth = new GoogleAuth({
    credentials: getGoogleServiceAccountCredentials(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const client = await auth.getClient();
  const spreadsheetId = getGoogleSheetId();
  const blocked = new Set(getBlockedSheetTabs());

  const metaRes = await client.request<{
    sheets?: Array<{ properties: { title: string } }>;
  }>({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    params: { fields: "sheets.properties.title" },
  });

  const allSheets = metaRes.data.sheets ?? [];
  const sheetInputs: SheetInput[] = [];

  for (let stateId = 0; stateId < allSheets.length; stateId++) {
    const title = allSheets[stateId]?.properties.title;
    if (!title || blocked.has(title)) continue;
    sheetInputs.push({ stateId, title, values: [] });
  }

  if (sheetInputs.length === 0) return [];

  const ranges = sheetInputs.map(
    ({ title }) => `'${title.replace(/'/g, "''")}'`,
  );

  const batchRes = await client.request<{
    valueRanges?: Array<{ values?: string[][] }>;
  }>({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet`,
    params: { ranges },
  });

  const valueRanges = batchRes.data.valueRanges ?? [];
  for (let i = 0; i < sheetInputs.length; i++) {
    sheetInputs[i]!.values = valueRanges[i]?.values ?? [];
  }

  const locations = buildLocationsFromSheetValues(sheetInputs);
  console.log(`[locations] Fetched ${locations.length} cities from Google Sheets`);
  return locations;
}

export function readLocationSnapshot(): LocationPageData[] | null {
  if (!existsSync(SNAPSHOT_PATH)) return null;
  return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf-8")) as LocationPageData[];
}

export function writeLocationSnapshot(locations: LocationPageData[]) {
  mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true });
  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(locations, null, 2)}\n`);
}

export async function syncLocationSnapshot(): Promise<LocationPageData[]> {
  const locations = await fetchLocationsFromSheets();
  writeLocationSnapshot(locations);
  console.log(`[locations] Wrote snapshot to ${SNAPSHOT_PATH}`);
  return locations;
}
