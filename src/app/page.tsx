import Section from "@/components/custom/Section";
import SectionGrid from "@/components/custom/SectionGrid";

export default function Home() {
  return (
    <>
      <nav></nav>
      <main>
        <SectionGrid className="grid-rows-3 grid-cols-3 gap-4">
          <div className="row-span-1 col-span-3  flex" >
            <h1 className="text-4xl lg:text-9xl  w-full flex-1 flex justify-center items-end align-bottom">
              Trikala Studios
            </h1>
          </div>
          <div className="col-span-3" >
            <h1 className="text-1xl lg:text-3xl w-full flex-1 flex justify-center items-center align-middle">
              comming soon :)
            </h1>
          </div>
        </SectionGrid>
        {/* <Section >
          <h1 className="text-3xl  w-full flex-1">hekko</h1>

          <h1 className="text-3xl  w-full flex-1">hekko</h1>
        </Section> */}
      </main>
    </>
  );
}
