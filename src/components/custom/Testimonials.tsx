import { cn } from "../../lib/utils";
import Marquee from "../ui/marquee";
import image1 from "../../assets/Digit.png"; // Ensure the path to the image is correct
import image2 from "../../assets/aesehi.png"; // Ensure the path to the image is correct
import image3 from "../../assets/hero3.png"; // Ensure the path to the image is correct
import image4 from "../../assets/hero4.png"; // Ensure the path to the image is correct
import Sections from "./Section";
import Image, { StaticImageData } from "next/image";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image1,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image2,
  },
  {
    name: "John",
    username: "@john",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image3,
  },
  {
    name: "Jane",
    username: "@jane",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image4,
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image1,
  },
  {
    name: "James",
    username: "@james",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image2,
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: StaticImageData;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative lg:w-[30vw] lg:h-auto h-auto w-[60vw]  cursor-pointer overflow-hidden  p-4 bg-cover bg-center",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "shadow-md "
      )}
      style={{ backgroundColor: "white" }}
    >
      <div className="flex flex-row items-center gap-[2vw]">
        <Image className="h-12 w-12 rounded-full" src={img} alt={name} />
        <div className="">
          <div className="text-xl font-medium text-black">{name}</div>
          <p className="text-gray-500">{username}</p>
        </div>
      </div>
      <div>
        <p className="mt-2 text-gray-700 text-[0.8rem] lg:text-[1rem]">
          {body}
        </p>
      </div>
    </figure>
  );
};

const Testimonials = () => {
  return (
    <Sections className="relative">
      <div className="flex lg:flex-row flex-col lg:gap-[20vh] z-30 justify-between items-start">
        <h1 className="text-[3rem] md:text-6xl lg:text-[6rem] font-custom text-left">
          What Our Clients <br /> have to say
        </h1>
        <span className="w-[40vh]">
          Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim,{" "}
        </span>
      </div>
      <div className="relative w-[200vw] -translate-x-1/2">
          <div className="absolute top-0 left-0 w-full h-full bg-custom-gradient z-10"></div>
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
      </div>
    </Sections>
  );
};

export default Testimonials;
