import { describe, expect, it } from "vitest";
import {
  FALLBACK_MENU_ITEMS,
  featuredProjectsToMenuItems,
} from "./heroFeaturedUtils";

describe("featuredProjectsToMenuItems", () => {
  it("returns fallback when empty", () => {
    expect(featuredProjectsToMenuItems([])).toEqual(FALLBACK_MENU_ITEMS);
  });

  it("maps featured projects with images", () => {
    const items = featuredProjectsToMenuItems([
      {
        id: "abc123",
        title: "Sky Villa",
        description: "A modern residence with panoramic views.",
        pdf: { url: "https://example.com/a.pdf", name: "a.pdf" },
        images: [{ url: "https://utfs.io/f/image.jpg", name: "image.jpg" }],
        type: "Residential",
        section: "hero",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    expect(items[0]).toMatchObject({
      title: "Sky Villa",
      image: "https://utfs.io/f/image.jpg",
      link: "/projects/abc123",
    });
  });
});
