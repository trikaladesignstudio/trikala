import Link from "next/link";
import Section from "./custom/Section";

function Video() {
  return (
    <Section className="max-h-screen px-0 ">
      <div className="w-full aspect-video flex relative group">
        <div className="aspect-video border border-black inset-0 w-[90%] absolute mx-auto  ">
          <Link
            href="/aboutus"
            className="absolute z-5 bottom-1/2 lg:right-0 lg:translate-y-1/2 lg:translate-x-1/2 bg-black border border-black rounded-lg text-white py-2 px-4 hover:bg-white hover:text-black transition-all duration-300 flex flex-col items-center gap-2"
          >
            <span className="text-xl">Read More about us</span>
            <span>Check out our story &rarr;</span>
          </Link>
          <iframe
            className="w-full aspect-video z-10"
            src="https://www.youtube.com/embed/-WKHnGln5Yg?autoplay=1&mute=1"
            title="Arogya Vanam of Rashtrapati Bhavan"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Section>
  );
}

export default Video;
