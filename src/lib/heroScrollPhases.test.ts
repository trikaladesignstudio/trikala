import { describe, expect, it } from "vitest";
import {
  FRAME_BLEED_PORTION,
  HEADLINE_HOLD_END,
  HEADLINE_HOLD_START,
  HERO_APPROACH_VIEWPORTS,
  HERO_ELEMENT_VIEWPORTS,
  segmentProgress,
} from "./heroScrollPhases";

describe("heroScrollPhases", () => {
  it("reserves approach scroll room for sticky hero", () => {
    expect(HERO_APPROACH_VIEWPORTS).toBe(0.35);
    expect(HERO_ELEMENT_VIEWPORTS).toBeCloseTo(1.35);
  });

  it("orders bleed then headline hold then exit", () => {
    expect(FRAME_BLEED_PORTION).toBe(0.08);
    expect(HEADLINE_HOLD_START).toBe(FRAME_BLEED_PORTION);
    expect(HEADLINE_HOLD_END).toBeCloseTo(0.28);
  });

  it("maps segment progress between bounds", () => {
    expect(segmentProgress(0, 0.2, 0.8)).toBe(0);
    expect(segmentProgress(0.5, 0.2, 0.8)).toBeCloseTo(0.5);
    expect(segmentProgress(1, 0.2, 0.8)).toBe(1);
  });
});
