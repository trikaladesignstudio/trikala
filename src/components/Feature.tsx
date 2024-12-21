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
import Section from "./custom/Section";
import { allProjectTypes } from "@/utils/client_utils";
import { Prisma } from "@prisma/client";
import { getAllFeaturedProjects } from "@/utils/dbActions";

const image = [image0, image1, image2, image1, image2, image1, image2, image3];
const types = Object.values(allProjectTypes);
types.pop();

function Featured() {
  const [currentActive, setCurrentActive] = useState(types[0]);
  const [projectData, setProjectData] = useState<
    Record<string, Prisma.ProjectCreateInput[]>
  >({});
  const filterType = (type: string) => {
    if (projectData[type]) {
      const projectImages = projectData[type]
        .map((project) => project.images)
        .flat()
        .map((image) => image?.url);
      return projectImages;
    }
    return [];
  };

  useEffect(() => {
    getAllFeaturedProjects()
      .then((data) => {
        // console.log("DATA,", data);
        setProjectData(data as any);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Section className="lg:px-0 px-0 lg:py-0 py-0 justify-start">
      <Section toSnap={false} className="min-h-fit lg:gap-12">
        <Heading className="text-5xl" text="Featured Work" />
        <motion.div className="top-8 lg:gap-8 gap-4 w-full grid grid-cols-2 lg:grid-cols-4 ">
          {types.map((type, index) => (
            <motion.div
              key={index}
              className={cn(
                "relative shadow-md hover:border-black/20 z-10 text-left p-2 px-4 cursor-pointer rounded-md animate-[bg_1s_ease-in-out] border -inset-0.5",
                currentActive == type ? "border  bg-black text-white" : ""
              )}
              onClick={() => setCurrentActive(type)}
            >
              {type}
            </motion.div>
          ))}
        </motion.div>
      </Section>
      {/* <Section
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
                  src={img as string}
                  width={150}
                  height={150}
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
      {/* </Section> */}
    </Section>
  );
}

export default Featured;
