"use client";

import Image from "next/image";
import image2 from "@/assets/Digit.png";
import Link from "next/link";
import Section from "../custom/Section";
import PriceForm from "../custom/PriceForm";
import { PieChartComponent } from "../custom/PieChart";
import { BarGraph } from "../custom/BarGraph";
import { useState } from "react";
import { motion } from "framer-motion";
import Heading from "../custom/Heading";

export default function PriceEstimator() {
  const [estimator, setEstimator] = useState("");

  const handleEstimator = (e: string) => {
    return () => {
      setEstimator(e);
    };
  };

  console.log("estimator:", estimator);
  return (
    <Section id="price-estimator" className="lg:py-0 max-h-fit w-full">
      <Heading className="text-center w-full" text="Interior Price Estimator" />
      <div className="flex flex-col lg:flex-row lg:gap-20 lg:justify-center">
        <Link
          onClick={handleEstimator("full-estimate")}
          href="#full-estimate"
          className="group lg:w-[20rem] overflow-hidden bg-white shadow-md transition-transform hover:scale-[1.02]"
        >
          <div className="">
            <Image
              loading="lazy"
              src={image2}
              alt="Traditional white house with wraparound porch"
              className="w-full o bject-cover"
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
          onClick={handleEstimator("kitchen-estimate")}
          href="#kitchen-estimate"
          className="group lg:w-[20rem] overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
        >
          <div className="aspect-[4/3] relative">
            <Image
              loading="lazy"
              src={image2}
              alt="Modern white kitchen with wooden accents"
              className="object-cover"
              fill
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="lg:text-lg text-sm font-medium">
                FREE KITCHEN ESTIMATE
              </span>
              <span className="text-xl transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </Link>
      </div>
      {estimator === "full-estimate" && (
        <div
          id="full-estimate"
          className="min-h-fit items-center justify-center gap-4 text-center"
        >
          <PriceForm />
          {/* <Section className="lg:flex-row-reverse flex-col max-h-screen lg:py-0 border-2 shadow-sm rounded-lg lg:px-0 lg:my-[5rem] lg:mx-[5rem] mx-[2rem] justify-between"> */}
          {/* <motion.section
            id="lead"
            className={"snap-always shrink-0 snap-start"}
            initial={{ height: "auto" }}
            animate={{ height: estimator ? "auto" : 0 }}
            transition={{ duration: 0.25, delay: 0.25, ease: "easeInOut" }}
            exit={{ height: 0 }}
          > */}
          <div className="flex flex-row-reverse">
            <PieChartComponent />
            <BarGraph />
          </div>
          {/* </Section> */}
          {/* </motion.section> */}
        </div>
      )}
    </Section>
  );
}
