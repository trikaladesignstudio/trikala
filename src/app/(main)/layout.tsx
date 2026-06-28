import DeferredFooter from "@/components/custom/DeferredFooter";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import { Suspense } from "react";

async function FooterWithData() {
  const footerData = await filterAllProjects(sectionType.contact);
  return <DeferredFooter data={footerData} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <FooterWithData />
      </Suspense>
    </>
  );
}
