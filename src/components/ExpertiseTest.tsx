"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { motion } from "framer-motion";
import Image from "next/image";
import Section from "./custom/Section";
import { expertiseData, expertiseDataType } from "@/jsonData/Home/Expertise";

interface CarouselDataProps {
  images: string[];
}

function CarouselData({ images }: CarouselDataProps) {
  return (
    <Carousel className="w-full m-auto" delay={3000}>
      <CarouselContent className="flex -ml-1">
        {images.map((img, index) => (
          <CarouselItem key={index} className="pl-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-shrink-0"
            >
              <Image
                loading="lazy"
                src={img}
                style={{ height: `25rem` }}
                alt={`Slide ${index}`}
                className="w-full object-cover rounded-md"
                width={1000}
                height={1000}
              />
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function ExpertiseTest() {
  const subSectionHeadings = [
    "Architecture Design",
    "Interior Design",
    "Landscape Design",
    "Urban Design",
  ];

  const [expertiseDataArray, setExpertiseData] = useState<expertiseDataType[]>(
    []
  );

  useEffect(() => {
    const tempExpertiseData: expertiseDataType[] = [];
    subSectionHeadings.map((item) => {
      tempExpertiseData.push({
        ...expertiseData[0],
        title: item,
      });
    });
    setExpertiseData(tempExpertiseData);
  }, [expertiseData]);

  return (
    <Section className="bg-black text-white gap-20">
      {expertiseDataArray.map((item) => (
        <div key={item.id} className="relative">
          <hr className="border-2" />
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 justify-between items-center pt-20">
              <div className="flex-1">
                <h1 className="text-5xl font-semibold">{item.title}</h1>
                <p className="text-xl pt-5">{item.description}</p>
              </div>
            </div>
            <CarouselData images={item.images} />
          </div>
        </div>
      ))}
    </Section>
  );
}

export default ExpertiseTest;
