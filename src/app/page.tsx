"use client";
import Footer from "@/components/custom/Footer";
// import Footer from "@/components/custom/Footer";
import Expertise from "@/components/custom/Expertise";
import Featured from "@/components/custom/Feature";
import Interior from "@/components/custom/Interior";
import Lead from "@/components/custom/Lead";
import SectionGrid from "@/components/custom/SectionGrid";
import Testimonials from "@/components/custom/Testimonials";
import Working from "@/components/custom/Working";
import { AnimatePresence } from "framer-motion";

import image from "../assets/aesehi.png";
import image2 from "../assets/dummy.png";
import Test from "@/components/custom/Test";

export default function Home() {

  const items = [
    { image: image, alt: 'Image 1' },
    { image: image2, alt: 'Image 2' },
    { image:image, alt: 'Image 3' },
    { image: image2, alt: 'Image 4' },
    { image: image, alt: 'Image 5' },
    { image: image2, alt: 'Image 6' }
  ];
  return (
    <>
      {/* <div className="absolute top-0 left-0 w-full h-full"> */}
      <main className="relative flex flex-col snap-y snap-mandatory h-screen overflow-y-scroll overflow-hidden">
        <AnimatePresence mode="wait" initial={false} >
          <nav className="snap-start">tjos</nav>
          <SectionGrid className="grid-rows-3 grid-cols-3 gap-4">
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
          </SectionGrid>
          {/* <Section >
          <h1 className="text-3xl  w-full flex-1">hekko</h1>
          
          <h1 className="text-3xl  w-full flex-1">hekko</h1>
        </Section> */}
          <Lead />
          <Working />
          <Interior />
          <Testimonials />
          <Footer />
        </AnimatePresence>
        <Lead/>
        <Featured/>
        <Expertise items={items}/>
        <Working/>
        <Interior/>
        <Test/>
        <Testimonials/>
      </main>
      {/* </div> */}
    </>
  );
}
