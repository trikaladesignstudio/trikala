"use client";
import Footer from "@/components/Footer";
import Interior from "@/components/Interior";
import Lead from "@/components/custom/Lead";
// import SectionGrid from "@/components/custom/SectionGrid";
import Working from "@/components/Working";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/custom/NavBar";
import Hero from "@/components/Hero";
import Featured from "@/components/Feature";
import Expertise from "@/components/Expertise";
import PriceEstimator from "@/components/PriceEstimator";
import Testimonials from "@/components/Testimonials";

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
