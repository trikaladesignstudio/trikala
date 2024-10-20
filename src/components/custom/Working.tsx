"use client";

import React, { useState } from "react";

import Sections from "./Section";
import Image from "next/image";
import Heading from "./Heading";
import { workingSlides } from "../../constants/index";

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
    <Sections>
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-20">
        <Heading className="flex-none">
          Our method of <br className="md:block hidden" /> working
        </Heading>
        <div className="flex flex-col justify-between ">
          <span className="text-sm  text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            dolorum nihil tempore corrupti culpa blanditiis, iusto modi nam,
            dignissimos quia enim ipsum ipsa reiciendis provident architecto
            sequi ab nisi commodi?
          </span>
          <div className="flex justify-end items-end gap-4 pb-4">
            <button
              onClick={prevSlide}
              className="fcc text-white left-4 p-2 bg-custom-db w-10 h-10 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="fcc text-white bg-custom-lb w-10 h-10 rounded-full"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <div className="flex overflow-hidden w-full justify-center mt-12 lg:gap-5 gap-2">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`relative transition-all duration-300 ease-in-out lg:h-[50vh] h-[25vh] ${
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
