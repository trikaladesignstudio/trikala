"use client";

import React, { useState, useEffect, useMemo } from "react";
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

const CarouselItemComponent: React.FC<{
  item: CarouselItem & { position: string };
  onClick: () => void;
}> = ({ item, onClick }) => (
  <div
    className={`transition-transform duration-500 ease-in-out px-2 md:px-4 ${item.position}`}
    onClick={onClick}
  >
    <Image
      src={item.image}
      alt={item.alt}
      className="lg:w-[20vw] lg:h-[60vh] h-[30vh] w-auto object-cover rounded-full border-2"
    />
  </div>
);

const Expertise: React.FC<CarouselProps> = ({ items = expertise }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const visibleItems = useMemo(() => {
    const totalItems = items.length;
    const positions = isMobile
      ? [activeIndex - 1, activeIndex, activeIndex + 1]
      : [
          activeIndex - 2,
          activeIndex - 1,
          activeIndex,
          activeIndex + 1,
          activeIndex + 2,
        ];

    const scales = isMobile
      ? ["scale-75 z-0", "scale-100 z-10", "scale-75 z-0"]
      : [
          "scale-50 z-0",
          "scale-75 z-0",
          "scale-100 z-10",
          "scale-75 z-0",
          "scale-50 z-0",
        ];

    return positions.map((pos, idx) => ({
      index: (pos + totalItems) % totalItems,
      ...items[(pos + totalItems) % totalItems],
      position: scales[idx],
    }));
  }, [activeIndex, items, isMobile]);

  return (
    <Sections className="lg:px-0 px-0 fcc w-full  gap-4 lg:min-h-fit">
      <Heading className="text-center">Expertise</Heading>
      <div className="relative flex justify-center w-full">
        <div className="flex w-full justify-between items-center transition-transform duration-500 ease-in-out">
          {visibleItems.map((item) => (
            <CarouselItemComponent
              key={item.index}
              item={item}
              onClick={() => handleClick(item.index)}
            />
          ))}
        </div>
      </div>
    </Sections>
  );
};

export default Expertise;
