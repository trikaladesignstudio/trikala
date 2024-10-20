import { cn } from "../../lib/utils";
import Sections from "./Section";
import Heading from "./Heading";
import { interior } from "../../constants/index";

const ReviewCard = ({ img, body }: { img: string; body: string }) => {
  return (
    <figure
      className={cn(
        "w-full h-[12vw] md:h-[10vw] lg:h-[8vw] xl:h-[6vw] cursor-pointer overflow-hidden bg-cover bg-center relative",
        "border-gray-950/[.1] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
      <span className="absolute inset-0 flex items-center justify-center text-white text-center text-sm font-semibold z-10">
        {body}
      </span>
    </figure>
  );
};

const Row = ({
  interior,
}: {
  interior: { img: string; body: string; username: string }[];
  alignRight?: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-between items-center w-full">
      {interior.map((review) => (
        <ReviewCard key={review.username} {...review} />
      ))}
    </div>
  );
};

const Interior = () => {
  return (
    <Sections className="border-4 border-green-800">
      <Heading className="text-center">
        Interior Solutions
      </Heading>
      <div className="flex flex-col gap-4 w-full">
          <Row
            interior={interior.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
          />
          <Row
            interior={interior.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
          />
          <Row
            interior={interior.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
          />
        <div>
          <Row
            interior={interior.map(({ img, body, username }) => ({
              img: img.src,
              body,
              username,
            }))}
          />
        </div>
      </div>
    </Sections>
  );
};

export default Interior;
