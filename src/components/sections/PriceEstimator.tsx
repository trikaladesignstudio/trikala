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
    <Section
      id="price-estimator"
      className="py-10 w-full gap-10 flex flex-col items-center bg-gray-50"
    >
      <Heading
        className="text-center w-full text-2xl font-bold text-gray-800"
        text="Interior Price Estimator"
      />
      {estimator === "" ? (
        <div className="flex flex-col md:flex-row md:gap-12 gap-6 justify-center items-center">
          <Link
            onClick={() => handleEstimator("full-estimate")}
            href="#full-estimate"
            className="group w-full lg:w-[30rem] bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            {/* <div className="relative h-48 w-full"> */}
              <Image
                loading="lazy"
                src={image2}
                alt="Traditional white house with wraparound porch"
                className="w-full h-full object-cover"
              />
            {/* </div> */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  FREE FULL HOME ESTIMATE
                </span>
                <span className="text-xl text-gray-500 transform transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
          <Link
            onClick={() => handleEstimator("kitchen-estimate")}
            href="#kitchen-estimate"
            className="group w-full lg:w-[30rem] bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            {/* <div className="relative h-48 w-full"> */}
              <Image
                loading="lazy"
                src={image2}
                alt="Modern white kitchen with wooden accents"
                className="w-full h-full object-cover"
              />
            {/* </div> */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  FREE KITCHEN ESTIMATE
                </span>
                <span className="text-xl text-gray-500 transform transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div id={estimator} className="w-full flex flex-col items-center">
          <button
            onClick={handleBack}
            className="mb-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            Back
          </button>
          <div className="w-full">
            <PriceForm />
          </div>
          <section className="w-full flex flex-col lg:flex-row gap-8 mt-8 justify-center items-center">
            <div className="w-full lg:w-1/3">
              <PieChartComponent />
            </div>
            <div className="w-full lg:w-2/3 overflow-x-auto">
              <BarGraph />
            </div>
          </section>
        </div>
      )}
    </Section>
  );
}
