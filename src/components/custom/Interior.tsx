import { cn } from "../../lib/utils";
import Sections from "./Section";
import Heading from "./Heading";
import { interior, interiorType } from "../../constants/index";
import Image, { StaticImageData } from "next/image";
import image1 from "@/assets/Digit.png";

const ReviewCard = ({ img, body }: { img: StaticImageData; body: string }) => {
  return (
    <div className="relative w-full h-[20vw] md:h-[10vw] xl:h-[5.5vw] cursor-pointer overflow-hidden">
      <Image src={img} alt={body} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <span className="absolute inset-0 flex items-center justify-center text-white text-center text-sm font-semibold z-10">
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
    <div className={cn("w-[125%] fr justify-between gap-2 ", className)}>
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
        "flex flex-col-reverse w-full gap-2 overflow-x-hidden relative",
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
    <Sections className="lg:px-0 px-0 lg:py-0 py-0 justify-between ">
      <Sections
        toSnap={false}
        className="text-center gap-4 min-h-fit p-12 flex-1 lg:px-0 px-0 justify-center"
      >
        <Heading className="">Interior Solutions</Heading>
        <BrickLayout interior={interior as interiorType[]} />
      </Sections>
    </Sections>
  );
};

export default Interior;
