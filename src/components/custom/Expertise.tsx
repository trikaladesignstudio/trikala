"use client";

import React, { useState, useMemo } from "react";
import Sections from "./Section";
import Image, { StaticImageData } from "next/image";
import { expertise } from "../../constants/index";
import Heading from "./Heading";
import { motion } from "framer-motion";

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
      className="lg:w-[20vw] lg:h-[70vh] h-[30vh] w-auto object-cover rounded-full border-2"
    />
  </div>
);

const Expertise: React.FC<CarouselProps> = ({ items = expertise }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const visibleItems = useMemo(() => {
    const totalItems = items.length;
    const positions = [activeIndex - 1, activeIndex, activeIndex + 1];
    const scales = ["scale-75 z-0", "scale-100 z-10", "scale-75 z-0"];
    return positions.map((pos, idx) => ({
      index: (pos + totalItems) % totalItems,
      ...items[(pos + totalItems) % totalItems],
      position: scales[idx],
    }));
  }, [activeIndex, items]);

  return (
    <Sections className="lg:px-0 px-0 fcc w-full  gap-4 lg:min-h-fit">
      <Heading className="text-center" text="Expertise" />
      <motion.div className="relative flex justify-center w-full">
        <div className="flex w-full justify-center items-center transition-transform duration-500 ease-in-out">
          {visibleItems.map((item) => (
            <CarouselItemComponent
              key={item.index}
              item={item}
              onClick={() => handleClick(item.index)}
            />
          ))}
        </div>
      </motion.div>
    </Sections>
  );
};

export default Expertise;
