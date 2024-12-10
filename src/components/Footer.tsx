"use client";

import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Heading from "./custom/Heading";
import Sections from "./custom/Section";
import { filterAllProjects } from "@/utils/dbActions";
import { useEffect, useState } from "react";
import { ContactDataType } from "@/types";

export default function Footer({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const router = useRouter();
  const [contactData, setContactData] = useState<ContactDataType[]>([]);
  useEffect(() => {
    const formatData = data.map((ele) => {
      return {
        title: ele.title,
        description: ele.description,
      };
    });
    setContactData(formatData);
  }, [data]);

  const regex = /(\w+):\s(https?:\/\/[^\s]+)/g;
  const matches: Record<string, string> = {};
  const socialData = contactData.find((ele) => ele.title === "SOCIAL");
  if (socialData && socialData.description) {
    let match;
    while ((match = regex.exec(socialData.description)) !== null) {
      const platform = match[1].toLowerCase();
      const url = match[2];
      matches[platform] = url;
    }
  }
  const instagramUrl = matches.instagram || "https://instagram.com/example";
  const facebookUrl = matches.facebook || "https://facebook.com/example";
  const youtubeUrl = matches.youtube || "https://youtube.com/example";
  const twitterUrl = matches.twitter || "https://twitter.com/example";

  return (
    <footer className="bg-black text-zinc-100">
      <Sections className="justify-center min-h-fit h-auto">
        <div className=" mx-auto space-y-16">
          <div className="flex lg:flex-row flex-col justify-between lg:gap-20 gap-8">
            {/* Main CTA Section */}
            <div className="space-y-4  lg:text-left text-center">
              <Heading
                text={`Shall we discuss\n the project ?`}
                className="lg:px-0 px-1 -tracking-tighter"
              />

              <p className="text-zinc-400">
                Leave a request using the button below and a manager will
                contact you shortly to discuss the details
              </p>
              <Button
                variant="outline"
                className="mt-4 border-zinc-700 text-zinc-100 hover:bg-zinc-900 hover:text-zinc-50"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  router.push("mailto:info@trikalarchitect.com");
                }}
              >
                Leave a request
                <span className="ml-2">+</span>
              </Button>
            </div>

            {/* Contact Grid */}
            <div className=" flex lg:flex-row flex-col-reverse justify-center items-center lg:text-left text-center lg:gap-32 gap-5">
              <div className="flex-col flex space-y-4">
                {/* Address */}
                <div className="">
                  <h3 className="text-zinc-500 text-sm tracking-wider">
                    ADDRESS
                  </h3>
                  <p className="text-zinc-100">
                    {
                      contactData.find((ele) => ele.title === "ADDRESS")
                        ?.description
                    }
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-4">
                  <h3 className="text-zinc-500 text-sm tracking-wider">
                    PHONE
                  </h3>
                  <Link
                    href="tel:+78124084151"
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    {
                      contactData.find((ele) => ele.title === "PHONE")
                        ?.description
                    }
                  </Link>
                </div>

                {/* Social Media */}
                <div className="space-y-4 flex flex-col justify-center lg:items-start items-center ">
                  <h3 className="text-zinc-500 text-sm tracking-wider">
                    SOCIAL MEDIA
                  </h3>
                  <div className="flex gap-4">
                    <Link
                      href={youtubeUrl}
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <FaYoutube />
                    </Link>
                    <Link
                      href={instagramUrl}
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <ImInstagram />
                    </Link>
                    <Link
                      href={facebookUrl}
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <FaFacebookF />
                    </Link>
                    <Link
                      href={twitterUrl}
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <FaTwitter />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact Emails */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-zinc-500 text-sm tracking-wider">MAIL</h3>
                  <Link
                    href={`mailto:${
                      contactData.find((ele) => ele.title === "EMAIL")
                        ?.description
                    }`}
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    {
                      contactData.find((ele) => ele.title === "EMAIL")
                        ?.description
                    }
                  </Link>
                </div>
                <div className="space-y-4">
                  <h3 className="text-zinc-500 text-sm tracking-wider">
                    DISCUSS THE PROJECT
                  </h3>
                  <Link
                    href={`mailto:${
                      contactData.find((ele) => ele.title === "EMAIL")
                        ?.description
                    }`}
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    {
                      contactData.find((ele) => ele.title === "EMAIL")
                        ?.description
                    }
                  </Link>
                </div>
                <div className="space-y-4">
                  <h3 className="text-zinc-500 text-sm tracking-wider">
                    SUPPLIERS
                  </h3>
                  <Link
                    href={`mailto:${
                      contactData.find((ele) => ele.title === "EMAIL")
                        ?.description
                    }`}
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    {
                      contactData.find((ele) => ele.title === "EMAIL")
                        ?.description
                    }
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between lg:items-start md:items-center gap-4">
            <Link
              href="/"
              className="flex justify-center items-center text-2xl md:text-3xl font-light tracking-tight"
            >
              <Image
                loading="lazy"
                src={"/static/logo.webp"}
                alt="logo"
                width={300}
                height={300}
                className="block invert"
              />
            </Link>

            <div className="flex lg:gap-8 gap-2 text-sm lg:flex-row flex-col lg:items-end items-center lg:justify-end justify-center">
              <Link
                href="/sitemap"
                className="text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Site Map
              </Link>
              <Link
                href="/agreement"
                className="text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                User Agreement
              </Link>
              <p className="text-zinc-600">
                {new Date().getFullYear()} &copy; Trikala Architecture Group
              </p>
            </div>
          </div>
        </div>
      </Sections>
    </footer>
  );
}
