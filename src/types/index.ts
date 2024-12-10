interface NavLink {
  name: string;
  href: string;
}

export const navlinks: NavLink[] = [
  // { name: "Home", href: "#" },
  { name: "About Us", href: "/aboutus" },
  { name: "Projects", href: "/projects" },
  { name: "Price Estimate", href: "/#price-estimator" },
];

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
