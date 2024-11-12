import { cn } from "../../lib/utils";
import Sections from "./Section";
import Heading from "./Heading";
import { interior, interiorType } from "../../constants/index";
import Image, { StaticImageData } from "next/image";
import image1 from "@/assets/Digit.png";

const ReviewCard = ({ img, body }: { img: StaticImageData; body: string }) => {
  return (
    <div className="relative w-full h-[12vw] md:h-[10vw] xl:h-[8vw] cursor-pointer overflow-hidden group drop-shadow-md hover:drop-shadow-xl">
      <Image src={img} alt={body} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-70 ease-in-out transition-all duration-300"></div>
      <span className="absolute inset-0 group-hover:opacity-100 opacity-0 ease-in flex  delay-200 animate-opacity  items-center justify-center m-auto  text-white text-center text-md font-semibold z-10 w-[20ch]">
        {body}
      </span>
    </div>
  );
};

const Row = ({
  interior,
  className,
}: {
  interior: interiorType[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-[125%] fr justify-between gap-4 ", // Restrict width and center row
        className
      )}
    >
      {interior.map((review) => (
        <ReviewCard key={review.username} {...review} />
      ))}
    </div>
  );
};

// to do: update the image here
const empty = { name: "", username: "", body: "", img: image1 };

const BrickLayout = ({
  interior,
  className,
}: {
  interior: interiorType[];
  className?: string;
}) => {
  // divide the whole data in sets of 4 ele in each row
  const formatedData: interiorType[][] = [];
  let currentChunk: interiorType[] = [];
  let count = 0;

  interior.forEach((item) => {
    currentChunk.push(item);
    count++;

    // Determine if we have filled the current chunk
    if (formatedData.length % 2 === 0 && count === 4) {
      formatedData.push(currentChunk);
      currentChunk = [];
      count = 0;
    } else if (formatedData.length % 2 !== 0 && count === 3) {
      formatedData.push(currentChunk);
      currentChunk = [];
      count = 0;
    }
  });

  // If there's any leftover items, we need to ensure we don't add them
  if (currentChunk.length > 0) {
    // Only add the leftover if it matches the expected size
    if (formatedData.length % 2 === 0 && currentChunk.length === 3) {
      formatedData.push(currentChunk);
    } else if (formatedData.length % 2 === 1 && currentChunk.length === 4) {
      formatedData.push(currentChunk);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col-reverse w-full gap-4 overflow-x-hidden relative",
        className
      )}
    >
      {/* Apply left margin to the first row */}
      {formatedData.map((row, index) => {
        if (index % 2 === 0) {
          const formatedRow = [...row, empty];
          return <Row key={index} interior={formatedRow} />;
        } else {
          const formatedRow = [empty, ...row, empty];
          return (
            <Row
              key={index}
              interior={formatedRow}
              className="relative -left-[12vw]"
            />
          );
        }
      })}
    </div>
  );
};

const Interior = () => {
  return (
    <Sections className="lg:px-0 px-0 lg:py-0 py-0 justify-end border">
      <Sections
        toSnap={false}
        className="text-center gap-4 min-h-fit lg:py-0 flex-1 lg:px-0 px-0  flex flex-col justify-end"
      >
        <Heading className="flex-1 fcc">Interior Solutions</Heading>
        <BrickLayout interior={interior as interiorType[]} />
      </Sections>
    </Sections>
  );
};

export default Interior;
