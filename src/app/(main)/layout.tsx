import DeferredFooter from "@/components/custom/DeferredFooter";
import { getContactProjects } from "@/utils/dbActions";
import { Suspense } from "react";

async function FooterWithData() {
  const footerData = await getContactProjects();
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
