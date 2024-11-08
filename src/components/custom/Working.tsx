"use client";

import React, { useState } from "react";

import Image from "next/image";
import { BiChevronLeft } from "react-icons/bi";
import { workingSlides } from "../../constants/index";
import { Button } from "../ui/button";
import Heading from "./Heading";
import Sections from "./Section";

const Working: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = workingSlides;

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
        <Heading className="flex-none">
          Our method of <br className="md:block hidden" /> working
        </Heading>
        <div className="flex flex-col justify-between ">
          <span className="text-md  text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            dolorum nihil tempore corrupti culpa blanditiis, iusto modi nam,
            dignissimos quia enim ipsum ipsa reiciendis provident architecto
            sequi ab nisi commodi? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Soluta dolorum nihil tempore corrupti culpa
            blanditiis, iusto modi nam, dignissimos quia enim ipsum ipsa
            reiciendis provident architecto sequi ab nisi commodi?
          </span>
          <div className="flex justify-end items-end gap-4 pb-4">
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
      <div className="flex overflow-hidden w-full justify-center lg:gap-5 gap-2">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`relative transition-all duration-300 ease-in-out lg:h-[55vh] h-[25vh] ${
              index === currentIndex ? "w-4/5" : "w-1/6"
            }`}
            onClick={() => handleClick(index)}
          >
            <div
              className={`absolute h-full bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent text-white w-full flex lg:flex-row flex-col justify-end items-center lg:items-end ${
                currentIndex !== index
                  ? "lg:justify-center"
                  : "lg:justify-between"
              }`}
            >
              <h2
                className={`font-bold p-2 ${
                  currentIndex !== index
                    ? "transform -rotate-90 lg:rotate-0 lg:my-0 my-4"
                    : ""
                }`}
              >
                {slide.heading}
              </h2>
              {index === currentIndex && (
                //add delay for animation after slide get fully transformed to prevent flickering
                <p className="text-sm p-2">{slide.description}</p>
              )}
            </div>

            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className={`h-full mx-auto transition-all duration-500 ease-in-out object-cover ${
                index === currentIndex ? "w-full h-52" : "w-auto"
              }`}
            />
          </div>
        ))}
      </div>
    </Sections>
  );
};

export default Working;
