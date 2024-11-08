import aesehi from "@/assets/aesehi.png";
import Sections from "./Section";
import Image from "next/image";
import Heading from "./Heading";

function Featured() {
  return (
    <Sections>
      <div className="flex flex-col items-center lg:items-start">
        <Heading className="relative lg:top-[2rem] z-10 font-custom text-left">
          Featured Work
        </Heading>
        <Image
          src={aesehi}
          alt="Featured work"
          className="lg:h-[50vh] lg:w-[50vw] w-full"
        />

        <div className="relative lg:ml-[40vw] mt-[-20vh] bg-[#6f4638] p-4 text-white shadow-lg h-[40vh]">
          <h3 className="text-lg font-bold mb-2">Yorem ipsum d</h3>
          <p className="text-sm">
            Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim,
          </p>
        </div>
      </div>
    </Sections>
  );
}

export default Featured;
