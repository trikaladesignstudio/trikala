import React from "react";
import Section from "./custom/Section";

function Video() {
  return (
    <Section className="py-0 lg:py-0">
      <div className="w-full aspect-video flex justify-center items-center">
        <iframe
          width="677"
          height="381"
          src="https://www.youtube.com/embed/-WKHnGln5Yg?autoplay=1"
          title="Arogya Vanam of Rashtrapati Bhavan"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </Section>
  );
}

export default Video;
