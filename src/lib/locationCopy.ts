import { ProjectType } from "@/utils/client_utils";

type LocationContext = {
  city: string;
  state: string;
};

export function locationHeroTitle({ city }: LocationContext) {
  return `Architects & Interior Designers in ${city}`;
}

export function locationHeroSubtitle({ city, state }: LocationContext) {
  return `Trikala Architects delivers architecture, interior design, and landscape projects across ${city}, ${state}. From concept drawings to interior fit-out, we build residential and commercial spaces that work for how you live and work.`;
}

export function locationMetaDescription({
  city,
  state,
  priceLow,
  priceHigh,
}: LocationContext & { priceLow?: number; priceHigh?: number }) {
  const pricing =
    priceLow && priceHigh
      ? ` Interior design from ₹${priceLow}–₹${priceHigh} per sq ft.`
      : "";
  return `Architects, interior designers & architecture services in ${city}, ${state}.${pricing} View portfolio, indicative pricing, and start your project with Trikala Architects.`;
}

export function locationPricingHeading({ city }: LocationContext) {
  return `Interior design & architect fees in ${city}`;
}

export function locationNearbyLinkLabel(city: string, index: number) {
  return index % 2 === 0
    ? `Architects in ${city}`
    : `Interior designers in ${city}`;
}

const serviceHeadings: Record<ProjectType, (ctx: LocationContext) => string> = {
  [ProjectType.Architecture]: ({ city }) => `Architecture in ${city}`,
  [ProjectType.Interior]: ({ city }) => `Interior design in ${city}`,
  [ProjectType.Landscape]: ({ city }) => `Landscape design in ${city}`,
  [ProjectType.UrbanDesign]: ({ city }) => `Urban design in ${city}`,
  [ProjectType.none]: () => "",
};

export function locationServiceHeading(type: ProjectType, ctx: LocationContext) {
  return serviceHeadings[type](ctx);
}

const serviceCopy: Record<ProjectType, (ctx: LocationContext) => string> = {
  [ProjectType.Architecture]:
    ({ city }) =>
    `Full architectural design for homes, villas, and commercial buildings in ${city} — layouts, elevations, and statutory approvals.`,
  [ProjectType.Interior]:
    ({ city, state }) =>
    `Interior design for apartments and offices in ${city}, ${state} — material palettes, joinery details, and on-site coordination.`,
  [ProjectType.Landscape]:
    ({ city }) =>
    `Landscape planning for rooftops, courtyards, and campus open spaces across ${city}.`,
  [ProjectType.UrbanDesign]:
    ({ city }) =>
    `Master planning and urban design studies for mixed-use and institutional projects in ${city}.`,
  [ProjectType.none]: () => "",
};

export function locationServiceDescription(
  type: ProjectType,
  ctx: LocationContext
) {
  return serviceCopy[type](ctx);
}

export const locationProcessSteps = [
  {
    step: "01",
    title: "Design & Approval",
    description: "Brief, concept plans, and municipal approvals.",
  },
  {
    step: "02",
    title: "Structure",
    description: "Foundation, RCC, and shell completion on site.",
  },
  {
    step: "03",
    title: "MEP",
    description: "Electrical, plumbing, and core building services.",
  },
  {
    step: "04",
    title: "Interiors",
    description: "Finishes, fixtures, and handover-ready spaces.",
  },
] as const;
