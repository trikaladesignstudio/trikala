"use client";

import Image from "next/image";
import { useState } from "react";
import { navlinks } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { startAProjectLink } from "@/constants";
import { buttonVariants } from "../ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className="px-[.2rem] lg:px-[5rem] absolute left-0 right-0 -top-2 z-20 text-black/90 flex flex-row items-center min-h-fit justify-between w-full py-1
      snap-start"
    >
      <Link href={"/"} className="font-bold">
        <Image
          priority
          src={"/static/logo.webp"}
          alt="Brand Logo"
          width={130}
          height={130}
          className="invert"
        />
      </Link>
      <div className="lg:hidden">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      <div className="hidden lg:flex space-x-16">
        {navlinks.map((link) => (
          <div className="relative group" key={link.name}>
            <a href={link.href} className="text-white font-semibold">
              {link.name}
            </a>
            <span className="absolute bottom-0 left-0 block w-0 h-[1.5px] bg-white font-semibold transition-all duration-300 group-hover:w-[70%]"></span>
          </div>
        ))}
      </div>
      <Link
        href={startAProjectLink}
        className={cn(
          buttonVariants({
            variant: "default",
          }),
          "lg:block bg-black border-gray-500/50 border-2 text-white px-4 transition-all duration-300 ease-in-out rounded-full",
          "flex items-center justify-center",
          "shadow-md hover:shadow-lg "
        )}
      >
        Start a Project &rarr;
      </Link>
      <div
        className={cn(
          "fixed inset-0 z-50 transform bg-gray-100 bg-opacity-90 w-full h-full transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="   h-full flex flex-col justify-center items-center relative">
          <button
            className="absolute top-4 right-4 text-custom-db focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <nav className="flex flex-col space-y-6 text-xl w-full ">
            {navlinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-gray-500 focus:underline underline-offset-4 animate-[underline] ease-in-out delay-75  text-center w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
