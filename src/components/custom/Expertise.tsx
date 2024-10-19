"use client";

import React, { useState } from "react";
import Sections from "./Section";
import Image, { StaticImageData } from "next/image";
import { expertise } from "../../constants/index";
import Heading from "./Heading";

interface CarouselItem {
  image: StaticImageData;
  alt: string;
}

interface CarouselProps {
  items?: CarouselItem[];
}

const Expertise: React.FC<CarouselProps> = ({ items = expertise }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const getVisibleItems = () => {
    const prevIndex1 = (activeIndex - 2 + items.length) % items.length;
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const nextIndex = (activeIndex + 1) % items.length;
    const nextIndex2 = (activeIndex + 2) % items.length;

    return [
      {
        index: prevIndex1,
        ...items[prevIndex1],
        position: "scale-50 z-0",
      },
      {
        index: prevIndex,
        ...items[prevIndex],
        position: "scale-75 z-0",
      },
      {
        index: activeIndex,
        ...items[activeIndex],
        position: "scale-100 z-10",
      },
      {
        index: nextIndex,
        ...items[nextIndex],
        position: "scale-75 z-0",
      },
      {
        index: nextIndex2,
        ...items[nextIndex2],
        position: "scale-50 z-0",
      },
    ];
  };

  return (
    <Sections>
      <Heading className="text-center">
        Expertise
      </Heading>
      <div className="flex items-center justify-center w-full relative">
        <div className="relative flex justify-center w-full">
          <div className="flex w-full justify-between items-center transition-transform duration-500 ease-in-out">
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
      </div>
    </Sections>
  );
};

export default Expertise;
