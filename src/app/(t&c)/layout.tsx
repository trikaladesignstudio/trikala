import Navbar from "@/components/custom/NavBar";
import BackToTopBtn from "@/components/BackToTop";
import Link from "next/link";

import { Suspense } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // effective for only first login
  return (
    <>
      <Navbar />
      <Suspense>{children}</Suspense>
      {/* back to dashboard */}
      <div className="fc justify-center items-center">
        <Link
          href="/"
          className="fr rounded-md gap-2 p-2 px-3 border bg-[#6c11ed] "
        >
          Back to Home &rarr;
        </Link>
      </div>
      <BackToTopBtn />
    </>
  );
}
