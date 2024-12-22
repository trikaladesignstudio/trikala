import Footer from "@/components/sections/Footer";
import { sectionType } from "@/utils/client_utils";
import { filterAllProjects } from "@/utils/dbActions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = await filterAllProjects(sectionType.contact);

  return (
    <>
      {children}
      <Footer data={footerData} />
    </>
  );
}
