const PRICE_REGEX = /\d+/g;

export function slugifyCity(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function parsePriceRange(raw: string): { low: number; high: number } {
  const cleaned = raw.replace(/,/g, "");
  const matches = cleaned.match(PRICE_REGEX);
  if (!matches || matches.length < 2) {
    return { low: 0, high: 0 };
  }
  const [low, high] = matches.slice(0, 2).map(Number);
  return { low, high };
}

export function cityHeader(headers: string[] = []) {
  return headers[0] ?? "City";
}

export function priceHeader(headers: string[] = []) {
  return headers[2] ?? headers[1] ?? "Interior";
}

export function cellValue(
  row: string[],
  headers: string[],
  header: string,
  fallbackIndex: number,
) {
  const index = headers.indexOf(header);
  return row[index >= 0 ? index : fallbackIndex] ?? "";
}
