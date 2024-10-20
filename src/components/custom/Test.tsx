import { cn } from "@/lib/utils";
import Sections from "./Section";
import Heading from "./Heading";

// Assuming you have an array of interior items
const interiorItems = [
  { title: "MODULAR KITCHEN", img: "/placeholder.svg?height=200&width=300" },
  { title: "STORAGE & WARDROBE", img: "/placeholder.svg?height=200&width=300" },
  { title: "CROCKERY UNITS", img: "/placeholder.svg?height=200&width=300" },
  {
    title: "SPACE SAVING FURNITURE",
    img: "/placeholder.svg?height=200&width=300",
  },
  { title: "TV UNITS", img: "/placeholder.svg?height=200&width=300" },
  { title: "STUDY TABLE", img: "/placeholder.svg?height=200&width=300" },
  { title: "FALSE CEILING", img: "/placeholder.svg?height=200&width=300" },
  // Add more items as needed
];

const ReviewCard = ({ img, title }: { img: string; title: string }) => {
  return (
    <figure
      className={cn(
        "w-full h-40 cursor-pointer overflow-hidden bg-cover bg-center relative rounded-md",
        "border border-gray-200 hover:brightness-90 transition-all duration-300"
      )}
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <span className="absolute inset-0 flex items-center justify-center text-white text-center text-sm font-bold z-10 px-2">
        {title}
      </span>
    </figure>
  );
};

const BrickRow = ({
  items,
  offset,
}: {
  items: typeof interiorItems;
  offset?: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 w-full",
        offset && "ml-8"
      )}
    >
      {items.map((item, index) => (
        <ReviewCard key={index} {...item} />
      ))}
    </div>
  );
};

export default function Interiors() {
  const firstRowItems = interiorItems.slice(0, 4);
  const secondRowItems = interiorItems.slice(4, 7);

  return (
    <Sections>
      <Heading className="text-center mb-8">Interior Solutions</Heading>
      <div className="flex flex-col gap-4 w-full">
        <BrickRow items={firstRowItems} />
        <BrickRow items={secondRowItems} offset />
        <BrickRow items={firstRowItems} />
        <BrickRow items={secondRowItems} offset />
      </div>
    </Sections>
  );
}
