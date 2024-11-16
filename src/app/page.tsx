"use client";
import Footer from "@/components/custom/Footer";
import Expertise from "@/components/custom/Expertise";
import Featured from "@/components/custom/Feature";
import Interior from "@/components/custom/Interior";
import Lead from "@/components/custom/Lead";
// import SectionGrid from "@/components/custom/SectionGrid";
import Testimonials from "@/components/custom/Testimonials";
import Working from "@/components/custom/Working";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/custom/NavBar";
import Hero from "@/components/custom/Hero";
import PriceEstimator from "@/components/custom/PriceEstimator";

export default function Home() {
  return (
    <>
      <main className="relative flex flex-col snap-y snap-mandatory h-screen overflow-x-hidden scroll-smooth overflow-y-scroll">
        <AnimatePresence mode="wait" initial={false}>
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
          <Hero />
          {/* <Section >
          <h1 className="text-3xl  w-full flex-1">hekko</h1>
          
          <h1 className="text-3xl  w-full flex-1">hekko</h1>
          </Section> */}
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
