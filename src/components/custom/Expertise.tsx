"use client";

import React, { useState } from "react";
import Sections from "./Section";
import Image, { StaticImageData } from "next/image";
import { expertise } from "../../constants/index";

interface CarouselItem {
  image: StaticImageData;
  alt: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Expertise: React.FC<CarouselProps> = ({ items = expertise }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const getVisibleItems = () => {
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const nextIndex = (activeIndex + 1) % items.length;

    return [
      {
        index: prevIndex,
        ...items[prevIndex],
        position: "scale-75 blur-sm opacity-50 z-0",
      }, // Previous
      {
        index: activeIndex,
        ...items[activeIndex],
        position: "scale-100 blur-0 z-10",
      }, // Active
      {
        index: nextIndex,
        ...items[nextIndex],
        position: "scale-75 blur-sm opacity-50 z-0",
      }, // Next
    ];
  };

  return (
    <Sections>
      <h1 className="text-6xl md:text-6xl lg:text-9xl font-custom text-center">
        Expertise
      </h1>
      <div className="flex items-center justify-center w-full relative">
        <button
          onClick={handlePrevClick}
          className="bg-gray-600 bg-opacity-20 text-custom-db rounded-full font-bold p-2 absolute left-4 z-20 md:block hidden"
        >
          &lt;--Prev
        </button>
        <div className="relative flex justify-center w-full">
          <div className="flex w-full justify-center items-center transition-transform duration-500 ease-in-out">
            {getVisibleItems().map((item) => (
              <div
                key={item.index}
                className={`transition-transform duration-500 ease-in-out px-2 md:px-4 ${item.position}`}
                onClick={() => handleClick(item.index)}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  className="lg:w-[20vw] lg:h-[60vh] h-[40vh] object-cover rounded-full border-2"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleNextClick}
          className="bg-gray-600 bg-opacity-20 text-custom-db rounded-full font-bold p-2 absolute right-4 z-20 md:block hidden"
        >
          Next --&gt;
        </button>
      </div>
    </Sections>
  );
};

export default Expertise;
