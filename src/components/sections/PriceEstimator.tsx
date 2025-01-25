"use client";

import { rollInView } from "@/lib/utils";
import { filterAllProjects } from "@/utils/dbActions";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Heading from "../custom/Heading";
import PriceForm from "../custom/PriceForm";
import Section from "../custom/Section";

export default function PriceEstimator({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
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
      {estimator === "" ? (
        <>
          <Heading
            className="text-center w-full text-2xl font-bold text-gray-800"
            text="Price Estimator"
          />
          <div className="flex flex-col md:flex-row md:gap-12 gap-6 justify-center items-center">
            {data.map((item, index) => (
              <Link
                key={index}
                onClick={() => handleEstimator(item.title)}
                href={`#${item.title}`}
                className="group w-full lg:w-[30rem] bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <motion.div
                  variants={rollInView}
                  viewport={{ once: true }}
                  initial="base"
                  whileInView="show"
                  transition={{
                    ...rollInView.transition,
                    delay: 0.2,
                    duration: 0.5,
                  }}
                >
                  <Image
                    loading="lazy"
                    src={item.images[0].url}
                    width={300}
                    height={300}
                    alt="Traditional white house with wraparound porch"
                    className="w-full lg:h-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-700">
                        {item.title.toLocaleUpperCase()}
                      </span>
                      <span className="text-xl text-gray-500 transform transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div id={estimator} className="w-full">
          <PriceForm handleBack={handleBack} />
        </div>
      )}
    </Section>
  );
}
