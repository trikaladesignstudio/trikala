"use client";
import { filterAllProjects } from "@/utils/dbActions";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import Heading from "../custom/Heading";
import Sections from "../custom/Section";
import { Button } from "../ui/button";
import { rollInView } from "@/lib/utils";

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
    <Sections className="lg:py-0 justify-center lg:gap-10">
      <Heading text="Our work is based on the development of an individual approach to each client" />
      <motion.div
        variants={rollInView}
        viewport={{ once: true }}
        initial="base"
        whileInView="show"
        transition={{
          ...rollInView.transition,
          delay: 0.4,
          duration: 0.5,
        }}
        className="flex flex-col md:flex-row overflow-hidden w-full justify-center gap-2 md:h-auto h-full"
      >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className={`relative cursor-pointer  transition-all duration-500 ease-in-out md:h-[55vh] border-2   ${
              index === currentIndex
                ? "md:w-4/5 w-full h-[18vh]"
                : "md:w-1/6 w-full h-[6vh]"
            }`}
            onClick={() => handleClick(index)}
          >
            <div
              className={`absolute group h-full bottom-0 left-0 bg-gradient-to-t from-black/30 md:via-transparent via-black/30 md:to-transparent to-black/30  text-white w-full flex flex-col justify-center p-2 z-20 ${
                currentIndex !== index
                  ? "md:justify-center items-center"
                  : "md:justify-end"
              }`}
            >
              <div className="flex-col items-center justify-center ">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  exit={{ opacity: 0 }}
                  className={`font-bold p-2 md:hidden ${
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
                    className="font-bold p-2 lg:text-[1.8rem] text-[1.2rem] text-left "
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
                    className="text-sm p-2 text-justify leading-4"
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
          </motion.div>
        ))}
      </motion.div>
    </Sections>
  );
}

export default Working;
