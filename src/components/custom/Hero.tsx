import React from "react";
import Section from "./Section";
import Image from "next/image";
import image1 from "@/assets/Digit.png";
import HeroImages from "../ui/HeroImages";

function Hero() {
  return (
    <Section className="flex flex-col border border-red-800">
      <div className="flex flex-col gap-10 justify-between">
        <div className="border border-black">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="font-custom w-full text-custom-db text-[4rem] md:text-[6em] lg:text-[8rem] text-left tracking-wider leading-10	font-silver">
              Architect Your
            </div>
            <Image
              src={image1}
              alt=""
              className="w-[30rem] hidden lg:h-[8rem] lg:block rounded-full"
            />
          </div>
          <div className="flex flex-col lg:flex-row-reverse justify-between items-center">
            <div className="font-custom w-full text-custom-db text-[4rem] md:text-[6em] lg:text-[8rem] text-right tracking-wider font-silver">
              Idea to design
            </div>
            <Image
              src={image1}
              alt=""
              className="w-[30rem] hidden lg:h-[8rem] lg:block rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 justify-between flex-1 border border-black">
          <div className="lg:flex-1 justify-between">
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
                <Image src={image1} alt="" className="h-20" />
                <Image src={image1} alt="" className="h-20" />
              </div>
            </div>
          </div>
          <div className="w-[70%] h-auto">
            <HeroImages />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Hero;
