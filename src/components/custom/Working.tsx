"use client";

import React, { useState } from "react";

import Image from "next/image";
import { BiChevronLeft } from "react-icons/bi";
import { WorkingsData } from "@/jsonData/Home/Working/index";
import { Button } from "../ui/button";
import Heading from "./Heading";
import Sections from "./Section";
import { AnimatePresence, motion } from "framer-motion";

const Working: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = WorkingsData;

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
    <Sections className="lg:py-0 justify-center">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-20">
        <div className="flex-none">
          <Heading
            text="Our method of"
          />
          <Heading className="md:block hidden" text="working" />
        </div>
        <div className="flex flex-col justify-between">
          <span className="text-md  text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            dolorum nihil tempore corrupti culpa blanditiis, iusto modi nam,
            dignissimos quia enim ipsum ipsa reiciendis provident architecto
            sequi ab nisi commodi? Lorem ipsum dolor sit amet consectetur
            dignissimos quia enim ipsum ipsa reiciendis provident architecto
            sequi ab nisi commodi? Lorem ipsum dolor sit amet consectetur
          </span>
          <div className=" justify-end items-end gap-4 pb-4 pt-4 hidden lg:flex">
            <Button
              onClick={prevSlide}
              className="fcc text-white left-4 p-2 bg-custom-db w-12 h-12 rounded-full"
            >
              <BiChevronLeft size={24} />
            </Button>
            <Button
              onClick={nextSlide}
              className="fcc text-white left-4 p-2 bg-custom-lb  w-12 h-12 rounded-full"
            >
              <BiChevronLeft size={24} className="rotate-180" />
            </Button>
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
              className={`absolute group h-full bottom-0 left-0 bg-gradient-to-t from-black/30 lg:via-transparent via-black/30 lg:to-transparent to-black/30  text-white w-full flex flex-col justify-center p-2 ${
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
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className={`h-full w-full transition-all duration-500 ease-in-out object-cover ${
                index === currentIndex ? "w-full h-52" : "w-auto"
              }`}
              width={300}
              height={300}
            />
          </div>
        ))}
      </div>
    </Sections>
  );
};

export default Working;
