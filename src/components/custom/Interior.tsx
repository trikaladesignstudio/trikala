import { cn } from "../../lib/utils";
import Sections from "./Section";
import Heading from "./Heading";
import { interior } from "../../constants/index";

const ReviewCard = ({ img, body }: { img: string; body: string }) => {
  return (
    <figure
      className={cn(
        "w-[16vw] h-[12vw] md:h-[10vw] lg:h-[8vw] xl:h-[8vw] cursor-pointer overflow-hidden bg-cover bg-center relative",
        "border-gray-950/[.1] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
      <span className="absolute inset-0 flex items-center justify-center text-white text-center text-sm font-semibold z-10">
        {body}
      </span>
    </figure>
  );
};

const Row = (props: {
  interior: { img: string; body: string; username: string }[];
  className?: string;
}) => {
  return (
    <Sections
      toSnap={false}
      className={cn(
        "min-h-fit w-[150vw] mx-auto lg:px-0 lg:py-0 m-0 ", // Restrict width and center row
        props.className
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 w-full">
        {props.interior.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </div>
    </Sections>
  );
};

const Interior = () => {
  return (
    <Sections className="border-4 border-green-800 w-full lg:px-0">
      <Heading className="text-center">Interior Solutions</Heading>
      <div className="flex flex-col gap-4 w-full p-0 m-0 items-center">
        {/* Apply left margin to the first row */}
        <Row
          className="ml-[12vw]" // Left margin applied to the first row
          interior={interior.map(({ img, body, username }) => ({
            img: img.src,
            body,
            username,
          }))}
        />
        <Row
          className="mr-[12vw]" // Right margin applied to the second row
          interior={interior.map(({ img, body, username }) => ({
            img: img.src,
            body,
            username,
          }))}
        />
        <Row
          className="ml-20"
          interior={interior.map(({ img, body, username }) => ({
            img: img.src,
            body,
            username,
          }))}
        />
        {/* Apply right margin to the last row */}
        <Row
          className="mr-20" // Right margin applied to the last row
          interior={interior.map(({ img, body, username }) => ({
            img: img.src,
            body,
            username,
          }))}
        />
        {/* <Row
          className="ml-20"
          interior={interior.map(({ img, body, username }) => ({
            img: img.src,
            body,
            username,
          }))}
        /> */}
      </div>
    </Sections>
  );
};

export default Interior;
