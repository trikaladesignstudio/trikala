"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiSolidUpArrowAlt } from "react-icons/bi";

function BackToTopBtn() {
  const [scrollY, setScrollY] = useState(0);
  const [element, setElement] = useState<HTMLElement | null>(null);

  // Control animation using Framer Motion
  const controls = useAnimation();

  const parentCointerId = "mainCointainer";

  // Effect to update scroll position
  useEffect(() => {
    setElement(document.getElementById(parentCointerId));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = element?.scrollTop || window.scrollY;
      setScrollY(scrollPosition);
    };

    if (element) {
      element.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    // Clean up event listener on component unmount
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [element]);

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
      onClick={() =>
        element
          ? element.scrollTo({ top: 0, behavior: "smooth" })
          : window.scrollTo({ top: 0, behavior: "smooth" })
      }
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      id="back-to-top"
      className="bg-black border border-gray-700/70  font-bold fixed z-50 bottom-4 right-6 rounded-full shadow-xl text-white text-lg p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
    >
      <BiSolidUpArrowAlt size={30} />
    </motion.button>
  );
}

export default BackToTopBtn;
