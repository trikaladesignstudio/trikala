import Navbar from "@/components/custom/NavBar";
import Section from "@/components/custom/Section";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <div className="min-h-[70px] relative bg-black">
        <Navbar />
      </div>
      <Section className="flex flex-col items-center justify-center h-[100svh] gap-8">
        <div className="">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-lg">
            The page you are looking for does not exist.
          </p>
        </div>
        <Link
          href="/"
          className="p-2 rounded-md hover:bg-black hover:text-white "
        >
          Go back home &rarr;
        </Link>
      </Section>
    </>
  );
}
