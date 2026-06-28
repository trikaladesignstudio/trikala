"use client";

import React, { memo, use, useEffect, useState } from "react";
import Image from "next/image";
import { Prisma } from "@prisma/client";

import FramedHeroShell from "@/components/custom/FramedHeroShell";
import HeroHeadline from "@/components/custom/HeroHeadline";
import { shimmerBlur } from "@/lib/utils";

export default memo(function Hero({
  pData,
}: {
  pData: Promise<Prisma.ProjectCreateInput[]>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const data = use(pData);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
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
    <FramedHeroShell
      background={
        <>
          {images.map((image, index) => (
            <Image
              priority={index === 0}
              src={image as string}
              fill
              sizes="100vw"
              alt={`Trikala Architects project ${index + 1}`}
              key={index}
              blurDataURL={shimmerBlur}
              placeholder="blur"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                currentIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </>
      }
      headline={<HeroHeadline text="Trikala Architect" />}
    />
  );
});
