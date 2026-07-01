import Footer from "@/components/sections/Footer";
import { getContactProjects } from "@/utils/dbActions";
import { Suspense } from "react";

async function FooterWithData() {
  const footerData = await getContactProjects();
  return <Footer data={footerData} />;
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
