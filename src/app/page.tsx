import Section from "@/components/custom/Section";

export default function Home() {
  return (
    <>
      <nav></nav>
      <main>
        <Section className="flex-row">
          <h1 className="border-2 border-red-200 w-full flex-1 flex justify-center items-center align-middle">hekko</h1>
          <h1 className="border-2 border-red-200 w-full flex-1 flex justify-center items-center align-middle">hekko</h1>
          <h1 className="border-2 border-red-200 w-full flex-1 flex justify-center items-center align-middle">hekko</h1>
        </Section>
        <Section >
          <h1 className="text-3xl border-2 border-red-200 w-full flex-1">hekko</h1>

          <h1 className="text-3xl border-2 border-red-200 w-full flex-1">hekko</h1>
        </Section>
      </main>
    </>
  );
}
