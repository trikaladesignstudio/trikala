"use client";
import { filterAllProjects } from "@/utils/dbActions";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import Heading from "./custom/Heading";
import Sections from "./custom/Section";
import { Button } from "./ui/button";

function Working({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<typeof data>([]);

  useEffect(() => {
    // Remove number prefix from title and sort based on the extracted number
    const formatedData = data
      .map((item) => ({
        ...item,
        title: item.title.replace(/^\d. /, ""),
        numericTitle: parseInt(item.title.match(/^\d+/)?.[0] || "0", 10),
      }))
      .sort((a, b) => a.numericTitle - b.numericTitle)
      .map(({ numericTitle, ...item }) => item);

    setSlides(formatedData);
  }, [data]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Sections className="lg:py-0 justify-center gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-20">
        <Heading text="Our work is based on the development of an individual approach to each client" />
        <div className="flex flex-col justify-end">
          <div className=" justify-end items-end gap-4 pb-4 pt-4 hidden lg:flex">
            <motion.div className="hover:scale-105" whileTap={{ scale: 0.95 }}>
              <Button
                onClick={prevSlide}
                className="fcc text-white left-4 p-2 bg-custom-db w-12 h-12 rounded-full shadow-lg"
              >
                <BiChevronLeft size={24} />
              </Button>
            </motion.div>
            <motion.div className="hover:scale-105" whileTap={{ scale: 0.95 }}>
              <Button
                onClick={nextSlide}
                className="fcc text-white left-4 p-2 bg-primary border w-12 h-12 rounded-full shadow-lg"
              >
                <BiChevronLeft size={24} className="rotate-180 text-black" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row overflow-hidden w-full justify-center gap-2 lg:h-auto h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`relative  transition-all duration-500 ease-in-out lg:h-[55vh] border-2   ${
              index === currentIndex
                ? "lg:w-4/5 w-full h-[18vh]"
                : "lg:w-1/6 w-full h-[6vh]"
            }`}
            onClick={() => handleClick(index)}
          >
            <div
              className={`absolute group h-full bottom-0 left-0 bg-gradient-to-t from-black/30 lg:via-transparent via-black/30 lg:to-transparent to-black/30  text-white w-full flex flex-col justify-center p-2 z-20 ${
                currentIndex !== index
                  ? "lg:justify-center items-center"
                  : "lg:justify-end"
              }`}
            >
              <div className="flex-col items-center justify-center ">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  exit={{ opacity: 0 }}
                  className={`font-bold p-2 lg:hidden ${
                    currentIndex !== index
                      ? "transform lg:-rotate-90 rotate-0  lg:group-hover:block lg:rotate-270 lg:my-0 my-4 lg:text-[1.2rem]  text-center  lg:w-[100vw]"
                      : "lg:text-[1.5rem] text-left hidden "
                  }`}
                >
                  {slide.title}
                </motion.div>
                {index === currentIndex && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="font-bold p-2 lg:text-[1.5rem] text-left "
                  >
                    {slide.title}
                  </motion.div>
                )}

                {index === currentIndex && (
                  //add delay for animation after slide get fully transformed to prevent flickering
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="text-sm p-2 text-justify"
                  >
                    {slide.description}
                  </motion.div>
                )}
              </div>
            </div>

            <Image
              loading="lazy"
              src={slide?.images?.[0]?.url ?? "/static/logo.webp"}
              alt={`Slide ${index + 1}`}
              className={`h-full w-full transition-all duration-500 ease-in-out ${
                index === currentIndex ? "w-full h-52" : "w-auto object-cover"
              }`}
              width={300}
              height={300}
            />
            <div className="absolute inset-0 bg-black bg-opacity-35"></div>
          </div>
        ))}
      </div>
    </Sections>
  );
}

export default Working;
