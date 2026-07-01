import Navbar from "@/components/custom/NavBar";
import { resolveStartAProjectLink } from "@/lib/contactData";
import { getContactProjects } from "@/utils/dbActions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const startAProjectLink = resolveStartAProjectLink(await getContactProjects());

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col snap-none">
      <div className="relative shrink-0 bg-black">
        <Navbar startAProjectLink={startAProjectLink} />
      </div>
      {children}
    </div>
  );
}
