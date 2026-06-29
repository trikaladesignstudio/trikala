import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JsonLd from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  ORGANIZATION_JSON_LD,
  SITE_NAME,
  SITE_URL,
  WEBSITE_JSON_LD,
} from "@/lib/seo";
import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { extractRouterConfig } from "uploadthing/server";
import "./globals.css";
import BackToTopBtn from "@/components/BackToTop";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import ViewportHeightSync from "@/components/ViewportHeightSync";
import MainScrollContainer from "@/components/MainScrollContainer";
import PsudoScollBar from "@/components/PseudoScollBar";

const silver = localFont({
  src: "./Silver-Queen.otf",
  variable: "--font-silver",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Architects & Interior Designers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_NAME,
    description: `${SITE_NAME} - Architects & Interior Designers`,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/static/logo.webp",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: `${SITE_NAME} - Architects & Interior Designers`,
    images: ["/static/logo.webp"],
  },
  keywords: [
    "Trikal Architects",
    "Architects",
    "Interior Designers",
    "Interior Design",
    "Architecture",
    "Landscape Design",
    "Urban Design",
    "Home Design",
    "Commercial Design",
    "Office Design",
    "Residential Design",
    "Interior Designers in Delhi NCR",
    "Interior Designers in Delhi",
    "Interior Designers in Gurgaon",
    "Interior Designers in Gurugram",
    "Interior Designers in Noida",
    "Interior Designers in Faridabad",
    "Interior Designers in Ghaziabad",
    "Architect near Delhi",
    "Architect near me",
  ],
  icons: {
    icon: ["/logo.png?v=1"],
    apple: ["/logo.png?v=1"],
    shortcut: ["/logo.png?v=1"],
  },
  authors: [
    {
      name: "Tanya Agarwal",
      url: "https://www.instagram.com/trikalaarchitects/",
    },
  ],
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={[ORGANIZATION_JSON_LD, WEBSITE_JSON_LD]} />
        <link rel="preconnect" href="https://utfs.io" />
        <link rel="dns-prefetch" href="https://utfs.io" />
        <link
          rel="preload"
          href="/static/logo.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${silver.variable} antialiased`}
      >
        {/* <TwScreenInfo /> */}
        <NextTopLoader height={3} color="#1A1A1A" showSpinner={false} />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ViewportHeightSync />
        <MainScrollContainer>
          <BackToTopBtn />
          <PsudoScollBar />
          {children}
        </MainScrollContainer>
        <Toaster />
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
