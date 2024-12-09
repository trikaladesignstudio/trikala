"use client";

import image1 from "@/assets/1.jpeg";
import image2 from "@/assets/2.jpeg";
import image3 from "@/assets/3.jpeg";
import image0 from "@/assets/aesehi.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Heading from "./custom/Heading";
import Sections from "./custom/Section";
import { allProjectTypes } from "@/utils/client_utils";
import { Prisma } from "@prisma/client";

const image = [image0, image1, image2, image1, image2, image1, image2, image3];
const types = Object.values(allProjectTypes);
types.pop();

function Featured({ data }: { data: Prisma.ProjectCreateInput[] }) {
  const [currentActive, setCurrentActive] = useState(types[0]);
  const [projectData, setProjectData] = useState(data);
  const filterType = (type: string) => {
    return image;
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Sections className="lg:px-0 px-0 lg:py-0 py-0 justify-center ">
      <Sections toSnap={false} className="min-h-fit ">
        <Heading className="text-5xl" text="Featured Work" />
        <motion.div
          layout
          className="flex flex-row flex-wrap top-8 lg:gap-8 gap-4  w-full"
        >
          {types.map((type, index) => (
            <motion.div
              key={index}
              className={cn(
                "relative z-10 text-left p-2 px-4 cursor-pointer animate-[bg_1s_ease-in-out] hover:border inset-0",
                currentActive == type
                  ? "border rounded-md  bg-black text-white"
                  : ""
              )}
              onClick={() => setCurrentActive(type)}
            >
              {type}
            </motion.div>
          ))}
        </motion.div>
      </Sections>
      {/* <Sections
        className="lg:px-0 px-0 lg:py-0 py-0 justify-end min-h-fit"
        toSnap={false}
      > */}
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {filterType(currentActive).map((img, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-shrink-0"
              >
                <Image
                  loading="lazy"
                  src={img}
                  style={{ height: `28rem` }}
                  alt={`Slide ${index}`}
                  className="w-auto object-cover "
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* </Sections> */}
    </Sections>
  );
}

export default Featured;
