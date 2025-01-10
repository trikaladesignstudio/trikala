"use client";

import {
  expertiseDataType,
  imagesWithProjectId,
} from "@/jsonData/Home/Expertise";
import { getAllProjectsGroupByType } from "@/utils/dbActions";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Section from "../custom/Section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { rollInView } from "@/lib/utils";
import Link from "next/link";

interface CarouselDataProps {
  images: imagesWithProjectId[];
}

function CarouselData({ images }: CarouselDataProps) {
  return (
    <Carousel className="w-full m-auto" delay={4000}>
      <CarouselContent className="flex -ml-1">
        {images.map(({ url: img, projectId }, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <motion.div
              variants={rollInView}
              initial="base"
              whileInView="show"
              viewport={{ once: true }}
              transition={{
                ...rollInView.transition,
                delay: 0.2 + index * 0.02,
              }}
              className="flex-shrink-0"
            >
              {projectId ? (
                <Link href={`/projects/${projectId}`}>
                  <Image
                    src={img}
                    alt={`Slide ${index}`}
                    className="w-full object-cover rounded-md h-[20rem] lg:h-[25rem]"
                    width={400}
                    height={400}
                  />
                </Link>
              ) : (
                <Image
                  src={img}
                  alt={`Slide ${index}`}
                  className="w-full object-cover rounded-md h-[20rem] lg:h-[25rem]"
                  width={400}
                  height={400}
                />
              )}
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
      <div className="py-4 border-t border-white"></div>
      <div className="lg:py-0 py-0 ">
        <div className="flex gap-10 flex-col">
          <div className="flex gap-4 justify-between items-center ">
            <motion.div className="flex-1">
              <motion.div
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{ ...rollInView.transition, delay: 0.2 }}
                className="text-5xl font-semibold text-white"
              >
                {expertise.title}
              </motion.div>
              <motion.p
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{ ...rollInView.transition, delay: 0.4 }}
                className="text-xl pt-5 text-white"
              >
                {expertise.description}
              </motion.p>
            </motion.div>
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
      {data.map((item, index) => (
        <Fragment key={index}>
          <Section className="bg-black min-h-screen">
            <motion.div className="flex flex-col transform ">
              <SingleExperize expertise={item} key={item.title} />
            </motion.div>
          </Section>
        </Fragment>
      ))}
    </>
  );
}

export default ExpertiseTest;
