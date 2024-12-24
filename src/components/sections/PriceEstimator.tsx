"use client";

import Image from "next/image";
import image2 from "@/assets/Digit.png";
import Link from "next/link";
import Section from "../custom/Section";
import PriceForm from "../custom/PriceForm";
import { PieChartComponent } from "../custom/PieChart";
import { BarGraph } from "../custom/BarGraph";
import { useState } from "react";
import Heading from "../custom/Heading";

export default function PriceEstimator() {
  const [estimator, setEstimator] = useState("");

  const handleEstimator = (e: string) => {
    setEstimator(e);
  };

  const handleBack = () => {
    setEstimator("");
  };

  return (
    <Section id="price-estimator" className="lg:py-0 max-h-fit w-full">
      <Heading className="text-center w-full" text="Interior Price Estimator" />
      {estimator === "" ? (
        <div className="flex flex-col lg:flex-row lg:gap-20 lg:justify-center">
          <Link
            onClick={() => handleEstimator("full-estimate")}
            href="#full-estimate"
            className="group lg:w-[20rem] overflow-hidden bg-white shadow-md transition-transform hover:scale-[1.02]"
          >
            <div className="">
              <Image
                loading="lazy"
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
            onClick={() => handleEstimator("kitchen-estimate")}
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
      ) : (
        <div
          id={estimator}
          className="min-h-fit flex flex-col gap-4 text-center"
        >
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 w-20"
          >
            Back
          </button>
          <PriceForm />
          <div className="flex flex-row-reverse">
            <PieChartComponent />
            <BarGraph />
          </div>
        </div>
      )}
    </Section>
  );
}
