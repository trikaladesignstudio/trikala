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
import Footer from "@/components/Footer";
import BackToTopBtn from "@/components/BackToTop";

export const revalidate = 0;

const silver = localFont({
  src: "./Silver-Queen.otf",
  variable: "--font-silver",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Trikal Architects",
  description: "Trikal Architects - Architects & Interior Designers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${silver.variable} antialiased `}>
      <body
        suppressHydrationWarning
        className={`relative flex flex-col snap-y snap-mandatory h-screen overflow-x-hidden scroll-smooth overflow-y-scroll`}
      >
        <NextTopLoader height={3} color="#3b82f6" />

        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
        <Footer />
        <BackToTopBtn />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
