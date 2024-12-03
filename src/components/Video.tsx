"use client";

import React, { useEffect, useRef, useState } from "react";
import Section from "./custom/Section";

function Video() {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <Section className="py-0 lg:py-0">
      <div
        ref={videoRef}
        className="w-full aspect-video flex justify-center items-center"
      >
        {isVisible && (
          <iframe
            width="677"
            height="381"
            src="https://www.youtube.com/embed/-WKHnGln5Yg?autoplay=1&mute=1"
            title="Arogya Vanam of Rashtrapati Bhavan"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </Section>
  );
}

export default Video;
