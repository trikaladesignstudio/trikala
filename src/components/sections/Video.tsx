'use client';
import Link from "next/link";
import Section from "../custom/Section";
import Heading from "../custom/Heading";
import { rollInView } from "@/lib/utils";
import { motion } from "framer-motion";

function Video() {
  return (
    <Section className="lg:min-h-[100svh] min-h-fit px-0 py-20 justify-center items-center">
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
        className="w-[95%] lg:w-[80%] p-2  h-fit lg:relative lg:block flex flex-col-reverse gap-10 lg:gap-0 "
      >
        <Link
          href="/aboutus"
          className="lg:absolute z-5 bottom-1/2 lg:right-0 lg:translate-y-1/2 lg:translate-x-1/2 bg-black border border-black rounded-lg text-white py-2 lg:px-4 px-1 hover:bg-white hover:text-black transition-all duration-300 flex flex-row lg:flex-col justify-center lg:justify-start gap-2 "
        >
          <Heading
            className="lg:text-xl text-sm font-poppins"
            text="Read More,"
          />
          <Heading
            className="lg:text-xl text-sm font-poppins "
            text="Check out our Story →"
          />
        </Link>
        <iframe
          loading="lazy"
          aria-label="Arogya Vanam of Rashtrapati Bhavan"
          className="w-full lg:h-full h-auto z-10 aspect-video rounded-xl shadow-xl"
          src="https://www.youtube.com/embed/-WKHnGln5Yg?autoplay=1&mute=1&loop=1"
          title="Arogya Vanam of Rashtrapati Bhavan"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </motion.div>
    </Section>
  );
}

export default Video;
