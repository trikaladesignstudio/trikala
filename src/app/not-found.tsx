import NavBarWithData from "@/components/custom/NavBarWithData";
import Section from "@/components/custom/Section";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <div className="relative shrink-0 bg-black">
        <NavBarWithData />
      </div>
      <Section className="flex flex-col items-center justify-center h-screen gap-8">
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
