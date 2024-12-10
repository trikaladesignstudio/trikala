export const expiresin1Day = 1 * 24 * 60 * 60 * 1000; // 1 day

export enum sectionType {
  hero = "hero",
  features = "features",
  expertise = "expertise",
  // interior = "interior",
  working = "working",
  testimonials = "testimonials",
  contact = "contact",
  none = "none",
}

export const allSections: sectionType[] = Object.values(sectionType);

export enum ProjectType {
  Landscape = "Landscape",
  Commercial = "Commercial",
  Residential = "Residential",
  UrbanDesign = "Urban Design",
  none = "none",
}

export const allProjectTypes: ProjectType[] = Object.values(ProjectType);
