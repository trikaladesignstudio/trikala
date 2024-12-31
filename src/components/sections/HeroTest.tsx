"use client";

import React, { memo, use, useEffect, useState } from "react";
import Section from "../custom/Section";
import Navbar from "../custom/NavBar";
import Heading from "../custom/Heading";
import { filterAllProjects } from "@/utils/dbActions";
import Image from "next/image";
import { Prisma } from "@prisma/client";

export default memo(function HeroTest({
  pData,
}: {
  pData: Promise<Prisma.ProjectCreateInput[]>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<String[]>([]);
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

    // console.log("projectImages", projectImages);

    if (projectImages.length === 0) {
      setImages(["/static/logo.webp"]);
    } else {
      const imgArr = projectImages.flat();
      if (imgArr.length > 0) {
        imgArr[0] && setImages([imgArr[0]]);
        imgArr.forEach((image, index) => {
          if (index === 0) return;
          setTimeout(() => {
            console.log("image", index);
            setImages((prevImages) => [...prevImages, image as string]);
          }, index * 6000);
        });
      }
    }
  }, [data]);

  return (
    <Section className="relative max-h-[100svh] bg-black">
      <Navbar />
      {images.map((image, index) => (
        <Image
          priority={index == 0 ? true : false}
          src={image as string}
          width={400}
          height={200}
          alt={`Image ${index}`}
          key={index}
          blurDataURL="URL"
          placeholder="blur"
          onLoad={() => {
            console.log("image loaded", image);
          }}
          className={`lg:aspect-[1.78] aspect-auto absolute inset-0 w-full h-full bg-cover bg-no-repeat object-cover lg:object-fill bg-center transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
          // style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      {/* background black and opacity */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-70">
        <Heading
          customDelay={1}
          text="Trikala Architect"
          className=" text-[4rem] md:text-[6em] lg:text-[10rem] mt-40 font-bold"
        />
      </div>
    </Section>
  );
});
