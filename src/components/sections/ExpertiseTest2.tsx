"use client";

import { expertiseDataType } from "@/jsonData/Home/Expertise";
import { getAllProjectsGroupByType } from "@/utils/dbActions";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Section from "../custom/Section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface CarouselDataProps {
  images: string[];
}

function CarouselData({ images }: CarouselDataProps) {
  return (
    <Carousel className="w-full m-auto  " delay={2000}>
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
                alt={`Slide ${index}`}
                className="w-full object-cover rounded-md h-[20rem] lg:h-[25rem]"
                width={400}
                height={400}
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

function SingleExperize({ expertise }: { expertise: expertiseDataType }) {
  return (
    <div key={expertise.id}>
      <div className="lg:py-0 py-0 ">
        <div className="flex gap-10 flex-col">
          <div className="flex gap-4 justify-between items-center ">
            <div className="flex-1">
              <h1 className="text-5xl font-semibold text-white">
                {expertise.title}
              </h1>
              <p className="text-xl pt-5 text-white">{expertise.description}</p>
            </div>
          </div>
          <CarouselData images={expertise.images} />
        </div>
      </div>
    </div>
  );
}

function ExpertiseTest({ data }: { data: expertiseDataType[] }) {
  return (
    <>
      {data.map((item) => (
        <Section className=" border-none bg-black">
          <motion.div className="flex flex-col transform ">
            <SingleExperize expertise={item} key={item.title} />
          </motion.div>
        </Section>
      ))}
    </>
  );
}

export default ExpertiseTest;
