interface NavLink {
  name: string;
  href: string;
}

export const navlinks: NavLink[] = [
  { name: "About", href: "/aboutus" },
  { name: "Projects", href: "/projects" },
  { name: "Estimate", href: "/#price-estimator" },
];

export type images = {
  url: string;
  name: string;
};

export interface TestimonialsDataType {
  title: string;
  company: string;
  description: string;
  images: string;
}

export interface ContactDataType {
  title: string;
  description: string;
}

export interface expertiseDataType {
  id: number;
  title: string;
  description: string;
  images: imagesWithProjectId[];
}

export type imagesWithProjectId = {
  url: string;
  projectId: string | null;
};
