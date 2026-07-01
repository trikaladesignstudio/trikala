import { describe, expect, it } from "vitest";
import { parsePriceRange, slugifyCity } from "./sheetRowUtils";

describe("slugifyCity", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyCity("New Delhi")).toBe("new-delhi");
    expect(slugifyCity("Gurgaon")).toBe("gurgaon");
  });

  it("strips special characters", () => {
    expect(slugifyCity("  Aligarh  ")).toBe("aligarh");
  });
});

describe("parsePriceRange", () => {
  it("parses comma-separated ranges", () => {
    expect(parsePriceRange("850 - 1,450")).toEqual({ low: 850, high: 1450 });
  });

  it("returns zeros for invalid input", () => {
    expect(parsePriceRange("")).toEqual({ low: 0, high: 0 });
    expect(parsePriceRange("N/A")).toEqual({ low: 0, high: 0 });
  });
});
