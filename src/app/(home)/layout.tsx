import Navbar from "@/components/custom/NavBar";
import Footer from "@/components/Footer";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // effective for only first login
  const footerData = await filterAllProjects(sectionType.contact);

  return (
    <>
      <Suspense>{children}</Suspense>
      <Footer data={footerData} />
    </>
  );
}
