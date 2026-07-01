import { describe, expect, it } from "vitest";
import {
  locationMetaDescription,
  locationNearbyLinkLabel,
  locationPricingHeading,
  locationServiceHeading,
} from "./locationCopy";
import { ProjectType } from "@/utils/client_utils";

const ctx = { city: "Gurgaon", state: "Haryana" };

describe("locationCopy keywords", () => {
  it("meta includes architecture services phrasing", () => {
    const desc = locationMetaDescription({ ...ctx, priceLow: 850, priceHigh: 1450 });
    expect(desc).toContain("Architects, interior designers & architecture services");
    expect(desc).toContain("Gurgaon");
  });

  it("service headings include city", () => {
    expect(locationServiceHeading(ProjectType.Architecture, ctx)).toBe(
      "Architecture in Gurgaon",
    );
    expect(locationServiceHeading(ProjectType.Interior, ctx)).toBe(
      "Interior design in Gurgaon",
    );
  });

  it("pricing heading combines interior and architect fees", () => {
    expect(locationPricingHeading(ctx)).toBe(
      "Interior design & architect fees in Gurgaon",
    );
  });

  it("nearby links alternate anchor text", () => {
    expect(locationNearbyLinkLabel("Karnal", 0)).toBe("Architects in Karnal");
    expect(locationNearbyLinkLabel("Karnal", 1)).toBe(
      "Interior designers in Karnal",
    );
  });
});
