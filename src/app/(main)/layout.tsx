import { filterAllProjects } from "@/utils/dbActions";
import { sectionType } from "@/utils/client_utils";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
  suspense: true,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = await filterAllProjects(sectionType.contact);

  return (
    <>
      {children}
      <Suspense>
        <Footer data={footerData} />
      </Suspense>
    </>
  );
}
