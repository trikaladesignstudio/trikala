"use server";

import { EstimaterDataType, locationType } from "@/types/actions";
import dataDoc from "./googleAuth";
import { getBlockedSheetTabs, getGoogleSheetUrl } from "./googleSheetsConfig";
import { revalidatePath } from "next/cache";

export { getGoogleSheetUrl };

const blockedSheetsInDoc = getBlockedSheetTabs();

const regex = /\d+/g;

export type CityRowType = {
  id: number;
  city: string;
  priceRange: string;
};

async function getSheetByIndex(state_id: number) {
  await dataDoc.loadInfo();
  const sheet = dataDoc.sheetsByIndex[state_id];
  if (!sheet) {
    throw new Error("State sheet not found");
  }
  await sheet.loadHeaderRow();
  return sheet;
}

function getCityHeader(sheet: Awaited<ReturnType<typeof getSheetByIndex>>) {
  return sheet.headerValues[0] ?? "City";
}

function getPriceHeader(sheet: Awaited<ReturnType<typeof getSheetByIndex>>) {
  return sheet.headerValues[2] ?? sheet.headerValues[1] ?? "Interior";
}

export async function getStates(): Promise<locationType[]> {
  "cache";
  await dataDoc.loadInfo();

  const states = dataDoc.sheetsByIndex
    .map((sheet, index) => {
      if (!blockedSheetsInDoc.includes(sheet.title)) {
        return {
          title: sheet.title,
          id: index,
        };
      }
    })
    .filter((item) => item) as locationType[];

  return states;
}

export async function get_cities(state_id: number) {
  "cache";
  const sheet = await getSheetByIndex(state_id);
  const rows = await sheet.getRows();
  const cityHeader = getCityHeader(sheet);

  const cities = rows.map((row, index) => ({
    title: row.get(cityHeader),
    id: index,
  }));

  return cities;
}

export async function getStateRows(state_id: number): Promise<CityRowType[]> {
  const sheet = await getSheetByIndex(state_id);
  const rows = await sheet.getRows();
  const cityHeader = getCityHeader(sheet);
  const priceHeader = getPriceHeader(sheet);

  return rows.map((row, index) => ({
    id: index,
    city: row.get(cityHeader) ?? "",
    priceRange: row.get(priceHeader) ?? "",
  }));
}

export async function get_data_by_location(state_id: number, city_id: number) {
  "cache";
  const sheet = await getSheetByIndex(state_id);
  const rows = await sheet.getRows();
  const priceHeader = getPriceHeader(sheet);
  const interior = rows[city_id].get(priceHeader)?.replace(/,/g, "") ?? "";

  const [ilow, ihigh] = interior.match(regex)!.map(Number);
  const iavg = (ilow + ihigh) / 2;

  return {
    regular: {
      interior: ilow,
      construction: 1000,
      days: 0.15,
    },
    luxury: {
      interior: iavg,
      construction: 1000,
      days: 0.15,
    },
    dwelling: {
      interior: ihigh,
      construction: 1000,
      days: 0.15,
    },
  } as unknown as EstimaterDataType;
}

async function getDefaultHeaders() {
  await dataDoc.loadInfo();
  const templateSheet = dataDoc.sheetsByIndex.find(
    (sheet) => !blockedSheetsInDoc.includes(sheet.title)
  );

  if (templateSheet) {
    await templateSheet.loadHeaderRow();
    if (templateSheet.headerValues.length > 0) {
      return [...templateSheet.headerValues];
    }
  }

  return ["City", "Region", "Interior Price Range"];
}

export async function addState(title: string) {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("State name is required");
  }

  await dataDoc.loadInfo();
  const exists = dataDoc.sheetsByIndex.some(
    (sheet) => sheet.title.toLowerCase() === trimmed.toLowerCase()
  );
  if (exists) {
    throw new Error("A state with this name already exists");
  }

  const headerValues = await getDefaultHeaders();
  await dataDoc.addSheet({
    title: trimmed,
    headerValues,
  });

  revalidatePath("/admin");
}

export async function addCityRow(
  state_id: number,
  city: string,
  priceRange: string
) {
  const trimmedCity = city.trim();
  const trimmedPrice = priceRange.trim();
  if (!trimmedCity || !trimmedPrice) {
    throw new Error("City and price range are required");
  }

  const sheet = await getSheetByIndex(state_id);
  const cityHeader = getCityHeader(sheet);
  const priceHeader = getPriceHeader(sheet);

  await sheet.addRow({
    [cityHeader]: trimmedCity,
    [priceHeader]: trimmedPrice,
  });

  revalidatePath("/admin");
}

export async function updateCityRow(
  state_id: number,
  row_index: number,
  city: string,
  priceRange: string
) {
  const trimmedCity = city.trim();
  const trimmedPrice = priceRange.trim();
  if (!trimmedCity || !trimmedPrice) {
    throw new Error("City and price range are required");
  }

  const sheet = await getSheetByIndex(state_id);
  const rows = await sheet.getRows();
  const row = rows[row_index];
  if (!row) {
    throw new Error("City row not found");
  }

  const cityHeader = getCityHeader(sheet);
  const priceHeader = getPriceHeader(sheet);

  row.set(cityHeader, trimmedCity);
  row.set(priceHeader, trimmedPrice);
  await row.save();

  revalidatePath("/admin");
}

export async function deleteCityRow(state_id: number, row_index: number) {
  const sheet = await getSheetByIndex(state_id);
  const rows = await sheet.getRows();
  const row = rows[row_index];
  if (!row) {
    throw new Error("City row not found");
  }

  await row.delete();
  revalidatePath("/admin");
}

export async function deleteState(state_id: number) {
  const sheet = await getSheetByIndex(state_id);
  if (blockedSheetsInDoc.includes(sheet.title)) {
    throw new Error("This sheet cannot be deleted");
  }

  await sheet.delete();
  revalidatePath("/admin");
}
