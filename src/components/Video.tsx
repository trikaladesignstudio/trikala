import Link from "next/link";
import Section from "./custom/Section";

function Video() {
  return (
    <Section className="lg:min-h-screen min-h-fit px-0 py-20 justify-center items-center">
      <div className="w-[80%] aspect-video h-auto lg:relative lg:block flex flex-col-reverse gap-10 lg:gap-0 ">
        <Link
          href="/aboutus"
          className="lg:absolute z-5 bottom-1/2 lg:right-0 lg:translate-y-1/2 lg:translate-x-1/2 bg-black border border-black rounded-lg text-white py-2 lg:px-4 px-1 hover:bg-white hover:text-black transition-all duration-300 flex flex-col items-center gap-2"
        >
          <span className="lg:text-xl text-sm">Read More about us</span>
          <span>Check out our story &rarr;</span>
        </Link>
        <iframe
          className="w-full  lg:h-full h-auto  z-10 rounded-xl shadow-md shadow-black"
          src="https://www.youtube.com/embed/-WKHnGln5Yg?autoplay=1&mute=1&loop=1"
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
