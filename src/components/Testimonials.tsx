import { cn } from "../lib/utils";
import Marquee from "./ui/marquee";
import { TestimonialsData } from "@/jsonData/Home/Testimonial/index";
import Sections from "./custom/Section";
import Image, { StaticImageData } from "next/image";
import Heading from "./custom/Heading";
import useScreenWidth from "@/hooks/ScreenResize";
import { useEffect } from "react";

const firstRow = TestimonialsData.slice(0, TestimonialsData.length / 2);
const secondRow = TestimonialsData.slice(TestimonialsData.length / 2);

const ReviewCard = ({
  images,
  title,
  company,
  description,
  screenSize,
}: {
  title: string;
  company: string;
  description: string;
  images: string;
  screenSize: ReturnType<typeof useScreenWidth>;
}) => {
  const inMobileView = screenSize.width < 768;
  return (
    <div
      className={cn(
        "relative h-auto flex flex-col gap-2 p-4 cursor-pointer",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "shadow-md "
      )}
      style={{ backgroundColor: "white" }}
    >
      <div className="flex flex-row items-center gap-3">
        <Image
          className="h-12 w-12 rounded-full"
          src={images}
          alt={title}
          width={20}
          height={20}
        />
        <div className="">
          <div className="text-xl font-medium text-black">{title}</div>
          <p className="text-gray-500">{company}</p>
        </div>
      </div>
      <div
        className={`flex-1 fcc m-auto`}
        style={{
          width: description.length / (inMobileView ? 7 : 4) + "ch",
        }}
      >
        <p className="text-gray-700 break-words text-[0.9rem] lg:text-[.8rem] xl:text-[.95rem] text-justify">
          {description}
        </p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const screenSize = useScreenWidth();
  return (
    <Sections className="lg:px-0  px-0 py-0 lg:py-0 snap-end max-h-screen gap-0">
      <div className="flex lg:flex-row flex-col px-[2rem] py-[1rem] lg:px-[5rem] gap-2 md:gap-20">
        <div className="text-left flex-none">
          <Heading className="text-left flex-none" text="What Our Clients" />
          <Heading className="text-left flex-none" text="have to say" />
        </div>
        <div className="flex lg:flex-row flex-col lg:gap-[20vh] z-30 justify-between items-start text-justify text-sm lg:text-md">
          Our testimonials showcase the trust and satisfaction of clients who
          {"'"}ve partnered with Trikala Architecture and Associates. From dream
          homes to innovative spaces, these stories highlight our commitment to
          excellence and collaboration. Discover how we bring visions to life
          with thoughtful design, building lasting relationships along the way.
          See why our clients love working with us!
        </div>
      </div>
      <Sections
        toSnap={false}
        className="gap-4 lg:py-0  min-h-fit lg:px-0 px-0 "
      >
        <div className="relative w-full">
          <div className="absolute top-0 left-0 w-full h-full bg-custom-gradient z-10 pointer-events-none" />
          <div className="relative w-full">
            <Marquee pauseOnHover className="[--duration:30s]">
              {firstRow.map((review) => (
                <ReviewCard
                  key={review.title}
                  {...review}
                  screenSize={screenSize}
                />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:30s]">
              {secondRow.map((review) => (
                <ReviewCard
                  key={review.title}
                  {...review}
                  screenSize={screenSize}
                />
              ))}
            </Marquee>
          </div>
        </div>
      </Sections>
    </Sections>
  );
};

export default Testimonials;
