import Image from "next/image";
import image2 from "@/assets/Digit.png";
import Link from "next/link";
import Section from "./Section";
import Heading from "./Heading";

export default function PriceEstimator() {
  return (
    <Section className="lg:py-0 max-h-screen lg:justify-evenly justify-center">
      <Heading className="text-center">Interior Price Estimator</Heading>
      <div className="flex flex-col lg:flex-row lg:gap-20 lg:justify-center">
        <Link
          href="#full-estimate"
          className="group lg:w-[20rem] overflow-hidden bg-white shadow-md transition-transform hover:scale-[1.02]"
        >
          <div className="">
            <Image
              src={image2}
              alt="Traditional white house with wraparound porch"
              className="w-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="lg:text-lg text-sm font-medium">
                FREE FULL HOME ESTIMATE
              </span>
              <span className="text-xl transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </Link>
        <Link
          href="#kitchen-estimate"
          className="group lg:w-[20rem] overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
        >
          <div className="aspect-[4/3] relative">
            <Image
              src={image2}
              alt="Modern white kitchen with wooden accents"
              className="object-cover"
              fill
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="lg:text-lg text-sm font-medium">FREE KITCHEN ESTIMATE</span>
              <span className="text-xl transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Section>
  );
}
