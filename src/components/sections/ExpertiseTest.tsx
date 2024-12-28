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
    <Carousel className="w-full m-auto" delay={2000}>
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

// const subSectionHeadings = [
//   "Architecture Design",
//   "Interior Design",
//   "Landscape Design",
//   "Urban Design",
// ];

function SingleExperize({ expertise }: { expertise: expertiseDataType }) {
  return (
    <div key={expertise.id}>
      <Section
        toSnap={false}
        className="lg:py-0 py-0 min-h-fit"
        style={{ width: `calc(100vw - 0.5rem)` }}
      >
        <div className="flex gap-10 flex-col">
          <div className="flex gap-4 justify-between items-center ">
            <div className="flex-1">
              <h1 className="text-5xl font-semibold">{expertise.title}</h1>
              <p className="text-xl pt-5">{expertise.description}</p>
            </div>
          </div>
          <CarouselData images={expertise.images} />
        </div>
      </Section>
    </div>
  );
}

function ExpertiseTest() {
  const [expertiseDataArray, setExpertiseData] = useState<expertiseDataType[]>(
    []
  );

  const [mainParentScoll, setMainParentScoll] = useState<HTMLElement | null>(
    null
  );
  // const mainParentScoll = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef(null);
  const refParentScroll = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const parentScoll = document?.getElementById(
      "mainCointainer"
    ) as HTMLElement;

    if (parentScoll) {
      setMainParentScoll(parentScoll);
    }
  }, []);

  useLayoutEffect(() => {
    const scrollref = scrollRef.current;
    if (scrollref) {
      scrollRef && setScrollRange(scrollref?.scrollWidth);
    }
  }, [scrollRef]);

  const { scrollYProgress } = useScroll({
    container: {
      current: mainParentScoll,
    },
    target: refParentScroll,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  // funk around here only
  const transform = useTransform(
    scrollYProgress,
    [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1],
    [
      0,
      0,
      -scrollRange,
      -scrollRange,
      -scrollRange * 2,
      -scrollRange * 2,
      -scrollRange * 3,
      -scrollRange * 3,
    ]
  );

  // useMotionValueEvent(transform, "change", (latest) => {
  //   console.log("latest transform:", latest);
  // });
  // useMotionValueEvent(scrollYProgress, "change", (latest) => {
  //   console.log("latest:", latest);
  // });

  useEffect(() => {
    getAllProjectsGroupByType().then((data) => {
      setExpertiseData(data);
    });
  }, []);

  return (
    <Section
      id="expertise_parent_cointainer"
      className="min-h-fit  bg-black text-white lg:px-0 px-0 py-0 lg:py-0"
    >
      <div ref={refParentScroll} className="flex flex-col relative ">
        <Section
          toSnap={false}
          className="lg:px-0 px-0 py-0 lg:py-0 sticky top-0 right-0 left-0"
        >
          <Section
            toSnap={false}
            className="lg:py-0 py-0 min-h-fit justify-center"
          >
            <hr className="border-2" />
          </Section>
          <motion.div
            style={{ translateX: transform }}
            ref={scrollRef}
            className="flex flex-row relative transform "
          >
            {expertiseDataArray.map((item) => (
              <SingleExperize expertise={item} key={item.title} />
            ))}
          </motion.div>
          <Section
            toSnap={false}
            className="lg:py-0 py-0 min-h-fit justify-center"
          >
            <hr className="border-2" />
          </Section>
        </Section>
        <div
          ref={ghostRef}
          style={{ height: scrollRange }}
          className="ghost w-full bg-transparent"
        />
      </div>
    </Section>
  );
}

export default ExpertiseTest;
