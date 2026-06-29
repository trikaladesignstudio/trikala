"use client";

import { expertiseDataType, imagesWithProjectId } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment } from "react";
import Section from "../custom/Section";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "../ui/carousel";
import { rollInView } from "@/lib/utils";
import Link from "next/link";

interface CarouselDataProps {
  images: imagesWithProjectId[];
  categoryTitle: string;
}

function CarouselData({ images, categoryTitle }: CarouselDataProps) {
  return (
    <Carousel className="w-full m-auto" delay={4000} loop={false}>
      <CarouselContent className="-ml-2">
        {images.map(({ url: img, projectId }, index) => (
          <CarouselItem key={index} className="pl-2 md:basis-1/2 lg:basis-1/3">
            <motion.div
              variants={rollInView}
              initial="base"
              whileInView="show"
              viewport={{ once: true }}
              transition={{
                ...rollInView.transition,
                delay: 0.2 + index * 0.02,
              }}
              className="w-full"
            >
              {projectId ? (
                <Link href={`/projects/${projectId}`}>
                  <Image
                    src={img}
                    alt={`${categoryTitle} project showcase`}
                    className="w-full object-cover rounded-md h-[14rem] sm:h-[18rem] md:h-[28rem] lg:h-[32rem]"
                    width={400}
                    height={400}
                  />
                </Link>
              ) : (
                <Image
                  src={img}
                  alt={`${categoryTitle} project showcase`}
                  className="w-full object-cover rounded-md h-[14rem] sm:h-[18rem] md:h-[28rem] lg:h-[32rem]"
                  width={400}
                  height={400}
                />
              )}
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="[&_button]:text-zinc-500 [&_button]:hover:text-white" />
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
                className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl"
              >
                {expertise.title}
              </motion.div>
              <motion.p
                variants={rollInView}
                viewport={{ once: true }}
                initial="base"
                whileInView="show"
                transition={{ ...rollInView.transition, delay: 0.4 }}
                className="pt-3 text-base text-white md:pt-4 md:text-lg lg:pt-5 lg:text-xl"
              >
                {expertise.description}
              </motion.p>
            </motion.div>
          </div>
          <CarouselData images={expertise.images} categoryTitle={expertise.title} />
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
