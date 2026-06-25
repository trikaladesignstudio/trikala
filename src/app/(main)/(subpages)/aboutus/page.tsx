"use client";

import Heading from "@/components/custom/Heading";
import Section from "@/components/custom/Section";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
  {
    letter: "T",
    title: "Tradition & Timelessness",
    description:
      "We respect the cultural heritage of our clients, incorporating timeless design elements that honor the past while embracing the future.",
  },
  {
    letter: "H",
    title: "Holistic Innovation",
    description:
      "Our innovative approach integrates cutting-edge technology, sustainable materials, and creative problem-solving to deliver exceptional results.",
  },
  {
    letter: "R",
    title: "Regenerative Design",
    description:
      "We prioritize eco-friendly designs, minimizing environmental impact through passive strategies, microclimate creation, and optimized resource use.",
  },
  {
    letter: "I",
    title: "Inclusive Excellence",
    description:
      "Our socio-cultural response to design ensures comfort, safety, and livability, while addressing economic viability and global relevance.",
  },
  {
    letter: "V",
    title: "Vibrant Sustainability",
    description:
      "Through post-occupancy evaluations, we measure our success, continually refining our methods to create sustainable, thriving environments.",
  },
  {
    letter: "E",
    title: "Evolving Excellence",
    description:
      "We strive for perfection, pushing boundaries in sustainable design, innovation, and heritage preservation.",
  },
];

export default function AbboutUs() {
  const [activeTab, setActiveTab] = useState("T");
  return (
    <>
      <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-[100svh] flex">
        <div className=" text-center px-8 py-4">
          <Heading text="About us" className="text-black" />
          <div className="lg:text-lg text-sm text-justify ">
            Trikala Architects, founded by Tanya Agarwal in 2020, specializes in
            innovative, sustainable design across Master Planning, Residential,
            Commercial, Institutional, and Interiors, with expertise in
            Sustainability, Landscape, and Digital Technologies. Based in India,
            the firm delivers functional, aesthetic, and environmentally
            responsible solutions, driven by creative excellence and a
            client-focused approach, aiming to inspire communities through
            impactful architecture.
          </div>  
        </div>
        <Image
          loading="lazy"
          src="/static/images/cover.svg"
          alt="image"
          className="w-full h-full lg:object-cover self-end"
          width={800}
          height={300}
        />
      </Section>
      <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-[100svh] justify-start">
        <div className="lg:mb-2 text-center bg-black text-white ">
          <Section toSnap={false} className="min-h-fit">
            <Heading text="Approach" className="text-white" />
            <div className="lg:text-xl text-sm text-justify ">
              Trikala Architects designs with purpose, focusing on comfort,
              safety, and liveability while aligning with India&apos;s diverse
              climates. We prioritize sustainability, economic viability, and
              global relevance, delivering innovative, user-centric solutions
              tailored to each client’s needs and aspirations.
            </div>
          </Section>
        </div>
        <Section toSnap={false} className="min-h-fit">
          <div className="container mx-auto">
            <div className="mb-6">
              <Heading text="THRIVE" className="text-center" />
              <Heading
                text="Our Guiding Principles"
                className="text-sm md:text-lg lg:text-xl text-center font-sans"
              />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 gap-4 mb-8">
                {principles.map((principle) => (
                  <TabsTrigger
                    key={principle.letter}
                    value={principle.letter}
                    className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${
                      activeTab === principle.letter
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {principle.letter}
                  </TabsTrigger>
                ))}
              </TabsList>
              {principles.map((principle) => (
                <TabsContent key={principle.letter} value={principle.letter}>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="lg:text-2xl text-lg  font-bold mb-4">
                        {principle.title}
                      </h2>
                      <p className="text-gray-700 lg:text-lg">
                        {principle.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Section>
      </Section>
    </>
  );
}
