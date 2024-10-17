import { cn } from "../../lib/utils";
import image1 from "@/assets/Digit.png"; // Ensure the path to the image is correct
import image2 from "@/assets/aesehi.png"; // Ensure the path to the image is correct
import image3 from "@/assets/hero3.png"; // Ensure the path to the image is correct
import image4 from "@/assets/hero4.png"; // Ensure the path to the image is correct
import Sections from "./Section";

const reviews = [
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image3,
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image4,
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image1,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
];

const ReviewCard = ({ img, body }: { img: string; body: string }) => {
  return (
    <figure
      className={cn(
        " w-[15vw] h-[10vh] lg:h-[18vh] cursor-pointer overflow-hidden bg-cover bg-center",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
      style={{ backgroundImage: `url(${img})` }}
    >
      <span className=" text-center text-sm text-white p-4">{body}</span>
    </figure>
  );
};

const Row = ({
  reviews,
}: {
  reviews: { img: string; body: string; username: string }[];
  alignRight?: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-center items-center w-full overflow-hidden">
      {reviews.map((review) => (
        <ReviewCard key={review.username} {...review} />
      ))}
    </div>
  );
};


const Interior = () => {
  return (
    <Sections className=" items-center justify-center w-full">
      <h1 className="text-6xl md:text-6xl lg:text-9xl font-custom text-center">
        Interior Solutions
      </h1>
      <div className=" flex flex-col ">
        <div className="relative">
          <Row
            reviews={reviews.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
          />
        </div>
        <div className="relative lg:mr-[9vw] mr-[18vw]">
          <Row
            reviews={reviews.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
            alignRight
          />
        </div>
        <div className="relative lg:ml-[9vw] ml-[18vw]">
          <Row
            reviews={reviews.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
          />
        </div>
        <div className="relative lg:mr-[9vw] mr-[18vw]">
          <Row
            reviews={reviews.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
            alignRight
          />
        </div>
        {/* <div className="relative ml-[20vw]">
        <Row reviews={reviews} />
        </div> */}
      </div>
    </Sections>
  );
};

export default Interior;
