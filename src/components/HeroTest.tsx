"use client";

import React, { useEffect, useState } from "react";
import Section from "./custom/Section";
import Navbar from "./custom/NavBar";
import Heading from "./custom/Heading";
import { filterAllProjects } from "@/utils/dbActions";
import Image from "next/image";

function HeroTest({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<String[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [images]);

  useEffect(() => {
    const projectImages = data.map((project) =>
      project.images.map((image) => image.url)
    );
    setImages(projectImages.flat());
  }, []);
  return (
    <Section className="relative ">
      <Navbar />
      {images.map((image, index) => (
        <Image
          // loading="lazy"
          priority
          // fetchPriority="high"
          // loading={currentIndex === index ? "eager" : "lazy"}
          src={image as string}
          width={1080}
          height={720}
          alt={`Image ${index}`}
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
          // style={{ backgroundImage: `url(${image})` }}
        ></Image>
      ))}
      {/* background black and opacity */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-70">
        <Heading
          text="Trikala Architect"
          className=" text-[4rem] md:text-[6em] lg:text-[10rem] mt-40 font-bold"
        />
      </div>
    </Section>
  );
}

export default HeroTest;
