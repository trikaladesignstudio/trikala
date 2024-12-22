import React from "react";
import Section from "./custom/Section";
import Image from "next/image";
import image1 from "@/assets/Digit.png";
import HeroImages from "./ui/HeroImages";
import Navbar from "./custom/NavBar";
import Heading from "./custom/Heading";

function Hero() {
  return (
    <Section className="flex flex-col py-0 lg:py-0 gap-12 max-h-[100dvh]">
      <Navbar />
      <div className="flex flex-col gap-10 justify-between  flex-1 ">
        <div className=" flex flex-col gap-4  ">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            {/* <div className=" border w-fit font-custom text-custom-db text-[4rem] md:text-[6em] lg:text-[8rem] text-left tracking-wider leading-10 font-silver	">
            </div> */}
            <Heading
              className="w-fit text-left tracking-wider text-[4rem] md:text-[6em] lg:text-[10rem]  leading-[5rem] "
              text="Architect Your"
            />
            <Image
              loading="lazy"
              src={image1}
              alt="hero"
              className="w-[30rem] hidden lg:h-[8rem] lg:block rounded-full flex-1"
            />
          </div>
          <div className="flex flex-col lg:flex-row-reverse justify-between items-center gap-10">
            <Heading
              className="w-fit text-right tracking-wider text-[4rem] md:text-[6em] lg:text-[10rem]  leading-[5rem] "
              text="Idea to design"
            />
            <Image
              loading="lazy"
              src={image1}
              alt="hero"
              className="w-[30rem] hidden lg:h-[8rem]  lg:block rounded-full flex-1"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 flex-1 ">
          <div className="flex-1 justify-between w-1/3">
            <div className="flex flex-col justify-between h-full">
              <button className="w-auto border p-2 pl-4 pr-4 rounded-full text-white bg-[#774931] font-bold">
                Start a Project &gt;
              </button>
              <span className="text-base text-justify">
                Signet Estate Group transforms complex development challenges
                into collaborative opportunities through a creative, flexible,
                and customized approach.
              </span>
              <div className="flex flex-row justify-between gap-[2rem]">
                <Image loading="lazy" src={image1} alt="" className="h-20" />
                <Image loading="lazy" src={image1} alt="" className="h-20" />
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full relative ">
            {/* ths */}
            <div className="absolute inset-0 w-[70vw] top-0 left-0 ">
              <HeroImages />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Hero;
