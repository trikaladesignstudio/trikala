import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { extractRouterConfig } from "uploadthing/server";
import "./globals.css";
import BackToTopBtn from "@/components/BackToTop";
import TwScreenInfo from "@/components/custom/TwScreenInfo";

const silver = localFont({
  src: "./Silver-Queen.otf",
  variable: "--font-silver",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Trikal Architects",
  description: "Trikal Architects - Architects & Interior Designers",
  openGraph: {
    title: "Trikal Architects",
    description: "Trikal Architects - Architects & Interior Designers",
    url: "https://trikalarchitects.com",
    siteName: "Trikal Architects",
    images: [
      {
        url: "https://trikalarchitects.com/logo.webp",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-IN",
    type: "website",
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
    "Design",
    "Sketches",
    "3D Models",
    "Interior Designers in Delhi NCR",
    "Interior Designers in Delhi",
    "Interior Designers in Gurgaon",
    "Interior Designers in Gurugram",
    "Interior Designers in Noida",
    "Interior Designers in Noida",
    "Interior Designers in Faridabad",
    "Interior Designers in Ghaziabad",
    "Inspiration for Interior Design",
    "Interior Design Ideas",
    "Interior Design Sketches",
    "Interior Sketches",
    "3D Models for Interior Design",
    "Architect neer delhi",
    "Architect neer me",
  ],
  icons: {
    icon: ["/logo.png?v=1"],
    apple: ["/logo.png?v=1"],
    shortcut: ["/logo.png?v=1"],
  },
  metadataBase: new URL("https://trikalarchitects.com"),
  authors: [
    { name: "rishi23root" },
    { name: "Rishabh Jain", url: "https://github.com/rishi23root" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${silver.variable} antialiased`}
      >
        <TwScreenInfo />
        <NextTopLoader height={3} color="#1A1A1A" />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <main
          id="mainCointainer"
          className="relative flex flex-col snap-y snap-mandatory h-[100dvh] overflow-x-hidden scroll-smooth"
        >
          <BackToTopBtn />
          {children}
        </main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
