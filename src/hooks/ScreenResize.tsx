"use client";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

// resize window with debounce
const useScreenWidth = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = debounce(() => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

export default useScreenWidth;
