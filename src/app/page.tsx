"use client";
import Footer from "@/components/Footer";
import Expertise from "@/components/ExpertiseTest";
import Featured from "@/components/Feature";
import Interior from "@/components/Interior";
import Lead from "@/components/custom/Lead";
// import SectionGrid from "@/components/custom/SectionGrid";
import Testimonials from "@/components/Testimonials";
import Working from "@/components/Working";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/custom/NavBar";
import Hero from "@/components/Hero";
import PriceEstimator from "@/components/PriceEstimator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import image1 from "@/assets/1.jpeg";
import image2 from "@/assets/2.jpeg";
import image3 from "@/assets/3.jpeg";
import image0 from "@/assets/aesehi.png";
import Image from "next/image";
import { motion } from "framer-motion";

const image = [image0, image1, image2, image1, image2, image1, image2, image3];

export default function Home() {
  return (
    <>
      <main className="relative flex flex-col snap-y snap-mandatory h-screen overflow-x-hidden scroll-smooth overflow-y-scroll">
        <AnimatePresence mode="wait" initial={true}>
          {/* <SectionGrid className="grid-rows-3 grid-cols-3 gap-4">
            <div className="row-span-1 col-span-3  flex">
              <h1 className="text-4xl lg:text-9xl  w-full flex-1 flex justify-center items-end align-bottom">
                Trikala Studios
              </h1>
            </div>
            <div className="col-span-3">
            <h1 className="text-1xl lg:text-3xl w-full flex-1 flex justify-center items-center align-middle">
            comming soon :)
            </h1>
            </div>
            </SectionGrid> */}
          <Carousel className="w-full m-auto">
            <CarouselContent className="-ml-1">
              {image.map((img, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={img}
                      style={{ height: `25rem` }}
                      alt={`Slide ${index}`}
                      className="w-auto object-cover "
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Hero />
          <Lead />
          <Featured />
          <Expertise />
          <Working />
          <PriceEstimator />
          <Interior />
          <Testimonials />
          {/* <Lead /> */}
          <Footer />
        </AnimatePresence>
      </main>
      {/* </div> */}
    </>
  );
}
