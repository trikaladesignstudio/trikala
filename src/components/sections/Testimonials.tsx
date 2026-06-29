"use client";

import useScreenWidth from "@/hooks/ScreenResize";
import Image from "next/image";
import { cn, rollInView, shimmerBlur } from "@/lib/utils";
import { filterAllProjects } from "@/utils/dbActions";
import { useEffect, useState } from "react";
import { TestimonialsDataType } from "@/types";
import { FormattedText } from "@/components/custom/FormattedText";
import Section from "../custom/Section";
import Heading from "../custom/Heading";
import Marquee from "../ui/marquee";
import { motion } from "framer-motion";

const ReviewCard = ({
  images,
  title,
  company,
  description,
  animationDelay,
  screenSize,
}: {
  title: string;
  company: string;
  description: string;
  images: string;
  animationDelay: number;
  screenSize: ReturnType<typeof useScreenWidth>;
}) => {
  const inMobileView = screenSize.width < 768;
  return (
    <motion.div
      variants={rollInView}
      viewport={{ once: true }}
      initial="base"
      whileInView="show"
      transition={{
        ...rollInView.transition,
        delay: animationDelay,
        duration: 0.5,
      }}
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
          loading="lazy"
          className="h-12 w-12 rounded-full"
          src={images}
          alt={title}
          width={20}
          height={20}
          placeholder="blur"
          blurDataURL={shimmerBlur}
        />
        <div className="">
          <div className="text-base font-medium text-black md:text-lg lg:text-xl">{title}</div>
          <p className="text-xs text-gray-500 md:text-sm">{company}</p>
        </div>
      </div>
      <div
        className={`flex-1 fcc m-auto`}
        style={{
          width: description.length / (inMobileView ? 7 : 4) + "ch",
        }}
      >
        <FormattedText className="break-words text-justify text-[0.78rem] leading-relaxed text-gray-700 sm:text-[0.85rem] lg:text-[0.95rem]">
          {description}
        </FormattedText>
      </div>
    </motion.div>
  );
};

function Testimonials({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const [testimonials, setTestimonials] = useState<TestimonialsDataType[]>([]);

  useEffect(() => {
    const formatData = data.map((ele) => {
      const titlendcompany = ele.title.split(" | ");
      const image = ele?.images[0]?.url ?? "/static/logo.webp";
      return {
        title: titlendcompany.length > 1 ? titlendcompany[0] : ele.title,
        company: titlendcompany.length > 1 ? titlendcompany[1] : ele.title,
        images: image,
        description: ele.description,
      };
    });
    setTestimonials(formatData);
  }, [data]);
  const screenSize = useScreenWidth();
  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);
  return (
    <Section className="lg:px-0 px-0 py-0 lg:py-0">
      <div className="page-px flex flex-col py-[0.1rem] gap-2 md:gap-6">
        <Heading
          className="text-left flex-none text-3xl md:text-5xl lg:text-7xl"
          text="What Our Clients Have to Say"
        />
        <motion.div
          variants={rollInView}
          viewport={{ once: true }}
          initial="base"
          whileInView="show"
          transition={{
            ...rollInView.transition,
            delay: 0.4,
            duration: 0.5,
          }}
          className="z-30 items-start justify-between text-justify text-sm md:text-base lg:text-lg"
        >
          Our testimonials reflect the trust of clients who’ve partnered with
          Trikala Architecture and Associates. From dream homes to innovative
          spaces, they showcase our excellence, collaboration, and lasting
          relationships, bringing visions to life with thoughtful design.
        </motion.div>
      </div>
      <div className="relative w-full">
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-custom-gradient pointer-events-none" />
        <div className="relative w-full">
          <Marquee pauseOnHover className="[--duration:30s]">
            {firstRow.map((review) => (
              <ReviewCard
                key={review.title}
                {...review}
                screenSize={screenSize}
                animationDelay={0.4}
              />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((review) => (
              <ReviewCard
                key={review.title}
                {...review}
                screenSize={screenSize}
                animationDelay={0.6}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </Section>
  );
}

export default Testimonials;
