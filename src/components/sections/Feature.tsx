"use client";

import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn, rollInView } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import Heading from "../custom/Heading";
import Section from "../custom/Section";
import { allProjectTypes } from "@/utils/client_utils";
import { Prisma } from "@prisma/client";
import { getAllFeaturedProjects } from "@/utils/dbActions";
import { images } from "@/types";
import Link from "next/link";

const types = Object.values(allProjectTypes);
types.pop();

function Featured() {
  const [currentActive, setCurrentActive] = useState(types[0]);
  const [projectData, setProjectData] = useState<
    Record<string, Prisma.ProjectCreateInput[]>
  >({});
  const filterType = (type: string) => {
    if (projectData[type]) {
      const projectImagesByProjectId = projectData[type]
        .map((project) => {
          return project.images
            ? (project.images as images[]).map(({ url }) => {
                return {
                  url: url,
                  projectId: project.pdf ? project.id : null,
                };
              })
            : [];
        })
        .flat();

      // console.log("data1234", projectImagesByProjectId);
      return projectImagesByProjectId;

      // const projectImages = projectData[type]
      //   .map((project) => project.images)
      //   .flat()
      //   .map((image) => image?.url);
      // return projectImages;
    }
    return [
      {
        url: "/static/logo.webp",
        projectId: null,
      },
      {
        url: "/static/logo.webp",
        projectId: null,
      },
      {
        url: "/static/logo.webp",
        projectId: null,
      },
      {
        url: "/static/logo.webp",
        projectId: null,
      },
    ];
  };

  useEffect(() => {
    getAllFeaturedProjects()
      .then((data) => {
        setProjectData(data as Record<string, Prisma.ProjectCreateInput[]>);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Section className="lg:px-0 px-0 lg:py-0 py-0 justify-center">
      <div className="page-px flex flex-col gap-8 lg:gap-12 w-full">
        <Heading className="text-5xl" text="Featured Work" />
        <motion.div className="top-8 lg:gap-8 gap-4 w-full grid grid-cols-2 lg:grid-cols-4 ">
          {types.map((type, index) => (
            <motion.div
              key={index}
              variants={rollInView}
              viewport={{ once: true }}
              initial="base"
              whileInView="show"
              transition={{
                ...rollInView.transition,
                delay: 0.2 + index * 0.2,
              }}
              className={cn(
                "relative shadow-md hover:border-black/20 z-10 text-left p-2 px-4 cursor-pointer rounded-md animate-[bg_1s_ease-in-out] border -inset-0.5",
                currentActive == type ? "border  bg-black text-white" : "",
                "flex justify-center items-center"
              )}
              onClick={() => setCurrentActive(type)}
            >
              {type}
            </motion.div>
          ))}
        </motion.div>
        <Carousel className="w-full" delay={3000}>
          <CarouselContent className="-ml-2">
            {filterType(currentActive).map(({ url: img, projectId }, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:basis-1/2 lg:basis-1/3"
              >
                {projectId ? (
                  <Link href={`/projects/${projectId}`}>
                    <motion.div
                      key={img}
                      variants={rollInView}
                      viewport={{ once: true }}
                      initial="base"
                      whileInView="show"
                      transition={{
                        ...rollInView.transition,
                        delay: 0.2 + 0.02 * index,
                      }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <Suspense>
                        <Image
                          src={img as string}
                          width={400}
                          height={400}
                          alt={`${currentActive} featured project`}
                          className="w-full h-[24rem] md:h-[28rem] lg:h-[32rem] object-cover rounded-md"
                        />
                      </Suspense>
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    key={img}
                    variants={rollInView}
                    viewport={{ once: true }}
                    initial="base"
                    whileInView="show"
                    transition={{
                      ...rollInView.transition,
                      delay: 0.2 + 0.02 * index,
                    }}
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <Suspense>
                      <Image
                        src={img as string}
                        width={400}
                        height={400}
                        alt={`${currentActive} featured project`}
                        className="w-full h-[24rem] md:h-[28rem] lg:h-[32rem] object-cover rounded-md"
                      />
                    </Suspense>
                  </motion.div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls />
        </Carousel>
      </div>
    </Section>
  );
}

export default Featured;
