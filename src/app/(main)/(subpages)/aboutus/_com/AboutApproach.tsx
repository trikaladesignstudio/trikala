import Heading from "@/components/custom/Heading";

export default function AboutApproach() {
  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-[2rem] py-12 lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-16 lg:px-[5rem] lg:py-20">
        <div className="flex flex-col gap-4">
          <Heading text="Approach" className="text-left text-white" />
          <div className="h-px w-12 bg-custom-premium" />
        </div>
        <p className="max-w-[65ch] text-left text-sm leading-relaxed text-zinc-300 md:text-base lg:text-lg lg:leading-relaxed">
          Trikala Architects designs with purpose, focusing on comfort, safety,
          and liveability while aligning with India&apos;s diverse climates. We
          prioritize sustainability, economic viability, and global relevance,
          delivering innovative, user-centric solutions tailored to each
          client&apos;s needs and aspirations.
        </p>
      </div>
    </section>
  );
}
