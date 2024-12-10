"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { BiSolidUpArrowAlt } from "react-icons/bi";

function BackToTopBtn() {
  const [scrollY, setScrollY] = useState(0);

  // Control animation using Framer Motion
  const controls = useAnimation();

  // Effect to update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect to trigger animation when scroll is more than 50%
  useEffect(() => {
    if (scrollY > 50) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [scrollY, controls]);

  // JSX for the component
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      id="back-to-top"
      className="bg-black border border-gray-700/70  font-bold fixed z-50 bottom-4 right-4 rounded-full shadow-xl text-white text-lg p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
    >
      <BiSolidUpArrowAlt size={30}/>
    </motion.button>
  );
}

export default BackToTopBtn;
