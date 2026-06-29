import { getGoogleSheetId } from "./googleSheetsConfig";

type GvizCell = { v?: string | number | null; f?: string };
type GvizRow = { c?: (GvizCell | null)[] };

export type PublicSheetTable = {
  title: string;
  headers: string[];
  rows: string[][];
};

function getCellValue(cell: GvizCell | null | undefined): string {
  if (!cell) return "";
  if (cell.f != null) return String(cell.f);
  if (cell.v != null) return String(cell.v);
  return "";
}

function inferStateTitle(firstHeader: string): string {
  return firstHeader.replace(/\s+cities?$/i, "").trim() || firstHeader || "Pricing";
}

function getConfiguredTabs(): string[] {
  const raw = process.env.GOOGLE_SHEET_TABS?.trim();
  if (!raw) return [];
  return raw.split(",").map((tab) => tab.trim()).filter(Boolean);
}

async function fetchGvizTable(sheetTitle?: string): Promise<PublicSheetTable> {
  const id = getGoogleSheetId();
  const sheetParam = sheetTitle
    ? `&sheet=${encodeURIComponent(sheetTitle)}`
    : "";
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json${sheetParam}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet data (${res.status})`);
  }

  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
  if (!match) {
    throw new Error("Unexpected sheet response format");
  }

  const data = JSON.parse(match[1]) as {
    status: string;
    errors?: { detailed_message?: string }[];
    table?: { cols?: { label?: string }[]; rows?: GvizRow[] };
  };

  if (data.status !== "ok") {
    throw new Error(
      data.errors?.[0]?.detailed_message ?? "Sheet query failed"
    );
  }

  const headers = (data.table?.cols ?? []).map((col) => col.label ?? "");
  const rows = (data.table?.rows ?? []).map((row) =>
    (row.c ?? []).map((cell) => getCellValue(cell))
  );

  return {
    title: sheetTitle ? sheetTitle : inferStateTitle(headers[0] ?? ""),
    headers,
    rows,
  };
}

export async function getPublicSheetTabs(): Promise<
  { title: string; sheetTitle?: string }[]
> {
  const tabs = getConfiguredTabs();
  if (tabs.length > 0) {
    return tabs.map((title) => ({ title, sheetTitle: title }));
  }

  const table = await fetchGvizTable();
  return [{ title: table.title }];
}

export async function getPublicSheetTable(
  stateId: number
): Promise<PublicSheetTable> {
  const tabs = getConfiguredTabs();

  if (tabs.length > 0) {
    const sheetTitle = tabs[stateId];
    if (!sheetTitle) {
      throw new Error("State sheet not found");
    }
    return fetchGvizTable(sheetTitle);
  }

  if (stateId !== 0) {
    throw new Error("State sheet not found");
  }

  return fetchGvizTable();
}

export function getCityHeader(headers: string[]) {
  return headers[0] ?? "City";
}

export function getPriceHeader(headers: string[]) {
  return headers[2] ?? headers[1] ?? "Interior";
}
