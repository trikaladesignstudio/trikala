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
import { expertiseData } from "@/jsonData/Home/Expertise";

interface CarouselDataProps {
  images: string[];
}

function CarouselData({ images }: CarouselDataProps) {
  return (
    <Carousel className="w-full m-auto">
      <CarouselContent className="flex -ml-1">
        {images.map((img, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-shrink-0"
            >
              <Image
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
  return (
    <Section className="bg-black text-white gap-20">
      {expertiseData.map((item) => (
        <div key={item.id} className="relative">
          <hr className="border-2" />
          <div className="absolute top-5 text-5xl font-bold">#{item.id}</div>
          <div className="flex gap-20 flex-col">
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
