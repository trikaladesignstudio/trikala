export enum sectionType {
  hero = "hero",
  features = "features",
  expertise = "expertise",
  interior = "interior",
  working = "working",
  testimonials = "testimonials",
  contact = "contact",
  none = "none",
}

export const allSections: sectionType[] = Object.values(sectionType);

export enum ProjectType {
  Workspace = "Workspace",
  Commercial = "Commercial",
  Residential = "Residential",
  UrbanDesign = "Urban Design",
  none = "none",
}

export const allProjectTypes: ProjectType[] = Object.values(ProjectType);
