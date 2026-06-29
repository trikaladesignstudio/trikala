"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { BiSolidUpArrowAlt } from "react-icons/bi";
import { MAIN_SCROLL_CONTAINER_ID, scrollToTop } from "@/lib/scrollToTop";

function BackToTopBtn() {
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const main = document.getElementById(MAIN_SCROLL_CONTAINER_ID);

    const handleScroll = () => {
      const mainScroll = main?.scrollTop ?? 0;
      const windowScroll = window.scrollY;
      setScrollY(Math.max(mainScroll, windowScroll));
    };

    main?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      main?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollY > 50) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [scrollY, controls]);

  return (
    <motion.button
      aria-label="Back to top"
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      id="back-to-top"
      className="fixed bottom-4 right-6 z-50 cursor-pointer rounded-full border border-gray-700/70 bg-black p-2 text-lg font-bold text-white shadow-xl transition-all duration-300 ease-in-out hover:bg-white hover:text-black"
    >
      <BiSolidUpArrowAlt size={30} />
    </motion.button>
  );
}

export default BackToTopBtn;
