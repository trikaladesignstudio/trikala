"use client";
import { useState, useEffect } from "react";
import image0 from "@/assets/aesehi.png";
import image1 from "@/assets/1.jpeg";
import image2 from "@/assets/2.jpeg";
import image3 from "@/assets/3.jpeg";
import Image from "next/image";
import { useMeasure } from "react-use";
import { motion } from "framer-motion";

const image = [image0, image1, image2, image3];
const HeroImages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(image);
  const [ref, messure] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(images.length, "this");
      setImages((images) => [...images.slice(1, images.length), images[0]]);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex-1 flex flex-row h-full overflow-x-hidden w-auto">
      <div
        ref={ref}
        className="flex duration-500 gap-2"
        // style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        // transition-transform
      >
        {messure.height &&
          images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-shrink-0"
            >
              <Image
                src={image}
                style={{ height: `${messure.height}px` }}
                alt={`Slide ${index}`}
                className="w-auto object-cover"
              />
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default HeroImages;
