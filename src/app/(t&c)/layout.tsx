import Navbar from "@/components/custom/NavBar";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // effective for only first login
  return (
    <>
      <div className="min-h-[70px] relative bg-black">
        <Navbar />
      </div>
      <Suspense>{children}</Suspense>
    </>
  );
}
