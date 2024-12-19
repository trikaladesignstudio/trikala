"use client";
import { expertiseData, expertiseDataType } from "@/jsonData/Home/Expertise";
import {
  motion,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import Section from "./custom/Section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

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

const subSectionHeadings = [
  "Architecture Design",
  "Interior Design",
  "Landscape Design",
  "Urban Design",
];

function SingleExperize({ expertise }: { expertise: expertiseDataType }) {
  return (
    <div key={expertise.id}>
      <Section
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

  const scrollRef = useRef(null);
  // const ghostRef = useRef(null);
  // const [scrollRange, setScrollRange] = useState(0);
  // const [viewportW, setViewportW] = useState(0);

  // useLayoutEffect(() => {
  //   scrollRef && setScrollRange(scrollRef.current?.scrollWidth);
  // }, [scrollRef]);

  // const onResize = useCallback((entries) => {
  //   for (let entry of entries) {
  //     setViewportW(entry.contentRect.width);
  //   }
  // }, []);

  // useLayoutEffect(() => {
  //   const resizeObserver = new ResizeObserver((entries) => onResize(entries));
  //   resizeObserver.observe(ghostRef.current);
  //   return () => resizeObserver.disconnect();
  // }, [onResize]);

  // const { scrollYProgress } = useViewportScroll();
  // const transform = useTransform(
  //   scrollYProgress,
  //   [0, 1],
  //   [0, -scrollRange + viewportW]
  // );
  // const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  // const spring = useSpring(transform, physics);

  useEffect(() => {
    const tempExpertiseData: expertiseDataType[] = [];
    subSectionHeadings.map((item) => {
      tempExpertiseData.push({
        ...expertiseData[0],
        title: item,
      });
    });
    // console.log("tempExpertiseData:", tempExpertiseData);
    setExpertiseData(tempExpertiseData);
  }, [expertiseData]);

  return (
    <Section className="justify-center bg-black text-white lg:px-0 px-0 relative">
      <div
        ref={scrollRef}
        className="fixed left-0 right-0 will-change-transform"
      >
        <Section className="lg:py-0 py-0 min-h-fit justify-center">
          <hr className="border-2" />
        </Section>
        <div className="flex flex-row border -translate-x-full">
          {expertiseDataArray.map((item) => (
            <SingleExperize expertise={item} />
          ))}
        </div>
        <Section className="lg:py-0 py-0 min-h-fit justify-center">
          <hr className="border-2" />
        </Section>
      </div>
    </Section>
  );
}

export default ExpertiseTest;
