"use client";

import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Heading from "../custom/Heading";
import Sections from "../custom/Section";
import { filterAllProjects } from "@/utils/dbActions";
import { useEffect, useState } from "react";
import { ContactDataType } from "@/types";
import { startAProjectLink } from "@/constants";

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
              <Link
                href={startAProjectLink}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "mt-4 border-zinc-700 text-zinc-100 hover:bg-zinc-900 hover:text-zinc-50",
                })}
              >
                Leave a request
                <span className="ml-2">+</span>
              </Link>
            </div>

            {/* Contact Grid */}
            <div className=" flex lg:flex-row flex-col-reverse justify-center items-center lg:text-left text-center lg:gap-32 gap-5">
              <div className="flex-col flex space-y-4">
                {/* Address */}
                <div className="">
                  <div className="text-zinc-500 text-sm tracking-wider">
                    ADDRESS
                  </div>
                  <p className="text-zinc-100">
                    {
                      contactData.find((ele) => ele.title === "ADDRESS")
                        ?.description
                    }
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-4">
                  <div className="text-zinc-500 text-sm tracking-wider">
                    PHONE
                  </div>
                  <Link
                    href={`tel:${
                      contactData.find((ele) => ele.title === "PHONE")
                        ?.description || "78124084151"
                    }`}
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
                  <div className="text-zinc-500 text-sm tracking-wider">
                    SOCIAL MEDIA
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href={youtubeUrl}
                      aria-label="Youtube"
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <FaYoutube />
                    </Link>
                    <Link
                      aria-label="Instagram"
                      href={instagramUrl}
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <ImInstagram />
                    </Link>
                    <Link
                      href={facebookUrl}
                      aria-label="Facebook"
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <FaFacebookF />
                    </Link>
                    <Link
                      href={twitterUrl}
                      aria-label="Twitter"
                      className="text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                      <FaTwitter />
                    </Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-zinc-500 text-sm tracking-wider">
                    MAIL
                  </div>
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
          <div className="border-t border-zinc-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 ">
            <Link
              href="/"
              className="flex justify-center items-center font-light tracking-tight "
            >
              <Image
                loading="lazy"
                src={"/static/logo.webp"}
                alt="logo"
                width={300}
                height={200}
                className="block invert h-[10vh] w-auto scale-125"
              />
            </Link>

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 mx-auto lg:mx-0">
              <div className="flex lg:gap-8 gap-2 text-sm flex-row lg:items-end items-center lg:justify-end justify-center">
                <Link
                  href="/sitemap.xml"
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  Site Map
                </Link>
                <Link
                  href="/privacyPolicy"
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/termAndCondition"
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  T&C
                </Link>
              </div>
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
