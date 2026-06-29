import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.FRONTEND ??
  "https://trikalarchitects.com";

export const SITE_NAME = "Trikal Architects";

export const DEFAULT_DESCRIPTION =
  "Trikala Architects creates eco-friendly, functional, and innovative spaces, inspiring communities through impactful architecture.";

const DEFAULT_OG_IMAGE = "/static/logo.webp";

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle =
    title === SITE_NAME ? `${SITE_NAME} - Architects & Interior Designers` : title;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [{ url: image, width: 800, height: 600 }],
      locale: "en-IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ArchitecturalService",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/static/logo.webp`,
  image: `${SITE_URL}/static/logo.webp`,
  description: DEFAULT_DESCRIPTION,
  areaServed: [
    "Delhi",
    "Gurgaon",
    "Gurugram",
    "Noida",
    "Faridabad",
    "Ghaziabad",
    "Delhi NCR",
  ],
  sameAs: [
    "https://www.instagram.com/trikalaarchitects/",
  ],
  email: "trikalaarchitects@gmail.com",
};

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};
