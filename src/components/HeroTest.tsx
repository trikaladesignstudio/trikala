import React, { useEffect, useState } from "react";
import Section from "./custom/Section";
import Navbar from "./custom/NavBar";
import Heading from "./custom/Heading";

const images = [
  "/static/images/1.jpg",
  "/static/images/2.jpg",
  "/static/images/3.jpg",
  "/static/images/4.jpg",
  "/static/images/5.jpg",
  "/static/images/6.jpg",
];

function HeroTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <Section className="relative ">
      <Navbar />
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
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
