"use client";

import React, { memo, use, useEffect, useState } from "react";
import Section from "../custom/Section";
import Navbar from "../custom/NavBar";
import Heading from "../custom/Heading";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import { shimmerBlur } from "@/lib/shimmer";

export default memo(function Hero({
  pData,
}: {
  pData: Promise<Prisma.ProjectCreateInput[]>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const data = use(pData);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [images]);

  useEffect(() => {
    const projectImages = data
      .map((project) => project?.images)
      .flat()
      .map((image) => image?.url)
      .flat();

    if (projectImages.length === 0) {
      setImages(["/static/logo.webp"]);
    } else {
      const imgArr = projectImages.flat();
      if (imgArr.length > 0) {
        if (imgArr[0]) {
          setImages([imgArr[0]]);
        }
        imgArr.forEach((image, index) => {
          if (index === 0) return;
          setTimeout(() => {
            setImages((prevImages) => [...prevImages, image as string]);
          }, index * 6000);
        });
      }
    }
  }, [data]);

  return (
    <Section className="relative min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-black">
      <Navbar />
      {images.map((image, index) => (
        <Image
          priority={index === 0}
          src={image as string}
          fill
          sizes="100vw"
          alt={`Image ${index}`}
          key={index}
          blurDataURL={shimmerBlur}
          placeholder="blur"
          className={`absolute inset-0 aspect-auto h-full w-full bg-cover bg-center bg-no-repeat object-cover transition-opacity duration-1000 lg:aspect-[1.78] lg:object-fill ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/35 via-black/25 to-black/45 text-white">
        <Heading
          customDelay={1}
          text="Trikala Architect"
          className="text-center text-[4rem] font-bold md:text-[6rem] lg:text-[8rem]"
        />
      </div>
    </Section>
  );
});
