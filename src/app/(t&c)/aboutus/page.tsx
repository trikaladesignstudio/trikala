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

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("T");
  return (
    <>
      <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-screen">
        <Section toSnap={false} className="min-h-fit flex-1">
          <div className="mb-2 text-center ">
            <Heading text="About us" />
            <div className="lg:text-xl">
              Founded by Tanya Agarwal in 2020, Trikala Architects is a
              visionary design firm dedicated to crafting innovative,
              sustainable spaces. Our integrated practice areas include Master
              Planning, Residential, Commercial, Institutional, and Interiors,
              supported by expertise in Sustainability, Landscape, and Digital
              Technologies. With a strong presence in India, we deliver holistic
              design solutions that blend functionality, aesthetics, and
              environmental responsibility. Our team's passion for creative
              excellence and client-centric approach drives our commitment to
              exceptional architecture and design. At Trikala Architects, we
              strive to make a lasting impact through our work, fostering
              meaningful relationships and built environments that inspire and
              uplift communities."
            </div>
          </div>
        </Section>
        <div className="w-full h-1/2 overflow-hidden text-center">
          <Image
            src="/static/images/workCulture.jpg"
            alt="image"
            className="w-full object-cover h-full"
            width={400}
            height={300}
          />
          text
        </div>
      </Section>
      <Section className="lg:px-0 px-0 lg:py-0 py-0 max-h-screen justify-start">
        <div className="lg:mb-2 text-center bg-black text-white ">
          <Section toSnap={false} className="min-h-fit">
            <Heading text="Approach" className="text-white" />
            <div className="lg:text-xl">
              At Trikala Architects, we design with purpose and passion. Our
              projects are guided by first principles, prioritizing comfort,
              safety, and liveability, while harmonizing with India's diverse
              climates and ecologies. We strive for sustainable, economically
              viable, and globally relevant solutions. We pioneer innovative
              designs, transcending conventional boundaries. Our user-centric
              approach addresses each client's unique brief, aspirations, and
              context, delivering perfection in every detail.
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
                      <h2 className="text-2xl font-bold mb-4">
                        {principle.title}
                      </h2>
                      <p className="text-gray-700 text-lg">
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
