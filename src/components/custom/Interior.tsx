import { cn } from "../../lib/utils";
import Sections from "./Section";
import Heading from "./Heading";
import {
  interiorData,
  interiorDataType,
} from "@/jsonData/Home/Interiors/index";
import Image, { StaticImageData } from "next/image";

const ReviewCard = ({
  image,
  description,
  title,
}: {
  image: string;
  description: string;
  title: string;
}) => {
  return (
    <div className="relative w-full h-[12vw] md:h-[10vw] xl:h-[8vw] cursor-pointer overflow-hidden group drop-shadow-md hover:drop-shadow-xl">
      <Image
        src={image}
        alt={description}
        className="w-full h-full object-cover"
        width={200}
        height={100}
      />
      <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-70 ease-in-out transition-all duration-300"></div>
      <div className="flex-col flex absolute inset-0 group-hover:opacity-100 opacity-0 ease-in  delay-200 animate-opacity  items-center justify-center text-white text-center text-md z-10 gap-4 p-4">
        <span className="text-xl  font-semibold">{title}</span>
        <span className="text-md">{description}</span>
      </div>
    </div>
  );
};

const Row = ({
  interiorData,
  className,
}: {
  interiorData: interiorDataType[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-[125%] fr justify-between gap-4 ", // Restrict width and center row
        className
      )}
    >
      {interiorData.map((review) => (
        <ReviewCard key={review.title} {...review} />
      ))}
    </div>
  );
};

// to do: update the image here
const empty = {
  id: 0,
  title: "",
  description: "",
  image: "/Projects/2.jpeg",
} as interiorDataType;

const BrickLayout = ({
  interiorData,
  className,
}: {
  interiorData: interiorDataType[];
  className?: string;
}) => {
  // divide the whole data in sets of 4 ele in each row
  const formatedData: interiorDataType[][] = [];
  let currentChunk: interiorDataType[] = [];
  let count = 0;

  interiorData.forEach((item) => {
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
          return <Row key={index} interiorData={formatedRow} />;
        } else {
          const formatedRow = [empty, ...row, empty];
          return (
            <Row
              key={index}
              interiorData={formatedRow}
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
        <Heading className="flex-1 fcc" text="Interior Solutions" />
        <BrickLayout interiorData={interiorData as interiorDataType[]} />
      </Sections>
    </Sections>
  );
};

export default Interior;
