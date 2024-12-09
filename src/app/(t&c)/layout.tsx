import Navbar from "@/components/custom/NavBar";
import Footer from "@/components/Footer";
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
    <div>
      <div className="app xl:px-[11%] md:px-[5%] px-[2%] py-[2.5rem] flex flex-col lg:gap-20 gap-8 w-full">
        <Navbar />
      </div>
      <main className="app xl:px-[11%] md:px-[5%] px-[2%] py-[2.5rem] flex flex-col lg:gap-20 gap-8">
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
        <Footer />
        <BackToTopBtn />
      </main>
    </div>
  );
}
