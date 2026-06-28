import { describe, expect, it } from "vitest";
import {
  DARK_BLEED_END,
  DARK_BLEED_START,
  FRAME_BLEED_PORTION,
  HEADLINE_FADE_END,
  HEADLINE_FADE_START,
  HERO_APPROACH_VIEWPORTS,
  HERO_ELEMENT_VIEWPORTS,
  segmentProgress,
} from "./heroScrollPhases";

describe("heroScrollPhases", () => {
  it("keeps a short approach scroll budget", () => {
    expect(HERO_APPROACH_VIEWPORTS).toBe(0.45);
    expect(HERO_ELEMENT_VIEWPORTS).toBeCloseTo(1.45);
  });

  it("orders animation windows without overlap gaps", () => {
    expect(FRAME_BLEED_PORTION).toBeLessThan(HEADLINE_FADE_START);
    expect(HEADLINE_FADE_END).toBeLessThan(DARK_BLEED_END);
    expect(DARK_BLEED_START).toBeLessThan(DARK_BLEED_END);
  });

  it("maps segment progress between bounds", () => {
    expect(segmentProgress(0, 0.2, 0.8)).toBe(0);
    expect(segmentProgress(0.5, 0.2, 0.8)).toBeCloseTo(0.5);
    expect(segmentProgress(1, 0.2, 0.8)).toBe(1);
  });
});
