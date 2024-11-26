import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { motion } from "framer-motion";
import Image from "next/image";
import image1 from "@/assets/1.jpeg";
import image2 from "@/assets/2.jpeg";
import image3 from "@/assets/3.jpeg";
import image0 from "@/assets/aesehi.png";
import Section from "./custom/Section";
import Heading from "./custom/Heading";
import { title } from "process";

const images = [image0, image1, image2, image1, image2, image1, image2, image3];

// const data = [
//   {
//     {
//     "id": 1,
//     "title": "MODULAR KITCHEN",
//     "images": [],
//     "description": ""
//   }
//   }
// ]

export function CarouselData() {
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
    <Section className=" bg-black text-white gap-20 ">
      <div className="relative">
        <hr className="border-2" />
        <div className="absolute top-5  text-5xl font-bold">#1</div>
        <div className="flex gap-20 flex-col">
          <div className="flex gap-4 justify-between items-center pt-20 ">
            <div className="flex-1">
              <h1 className="text-5xl font-semibold">Architectural design</h1>
              <p className="text-xl pt-5">
                We create unique architectural concepts that reflect your
                personality and meet your needs and preferences.
              </p>
            </div>
          </div>
          <CarouselData />
        </div>
      </div>
    </Section>
  );
}

export default ExpertiseTest;
