import { cn } from "../../lib/utils";
import Marquee from "../ui/marquee";
import image1 from "../../assets/Digit.png"; // Ensure the path to the image is correct
import image2 from "../../assets/aesehi.png"; // Ensure the path to the image is correct
import image3 from "../../assets/hero3.png"; // Ensure the path to the image is correct
import image4 from "../../assets/hero4.png"; // Ensure the path to the image is correct
import Sections from "./Section";
import Image, { StaticImageData } from "next/image";
import Heading from "./Heading";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euYorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
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
    <div
      className={cn(
        "relative h-auto flex flex-col gap-2 p-4 cursor-pointer",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "shadow-md "
      )}
      style={{ backgroundColor: "white" }}
    >
      <div className="flex flex-row items-center gap-3">
        <Image className="h-12 w-12 rounded-full" src={img} alt={name} />
        <div className="">
          <div className="text-xl font-medium text-black">{name}</div>
          <p className="text-gray-500">{username}</p>
        </div>
      </div>
      <div
        className={`flex-1 fcc`}
        style={{
          width: body.length / 5 + "ch",
        }}
      >
        <p className="text-gray-700 break-words text-[0.7rem] lg:text-[.8rem] xl:text-[.95rem]">
          {body}
        </p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <Sections className="lg:px-0 px-0">
      <Sections toSnap={false} className="gap-4 min-h-fit lg:py-0 py-0">
        <div className="flex lg:flex-row flex-col lg:gap-[20vh] z-30 justify-between items-start">
          <Heading className="text-left flex-none">
            What Our Clients <br /> have to say
          </Heading>
          <span>
            Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim,{" "}
          </span>
        </div>
      </Sections>
      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-custom-gradient z-10 pointer-events-none" />
        <div className="relative w-full">
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
      </div>
    </Sections>
  );
};

export default Testimonials;
