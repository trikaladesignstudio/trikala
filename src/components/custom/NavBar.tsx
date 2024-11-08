import React, { useState } from "react";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.png";
import Image from "next/image";
import { navlinks } from "../../constants/index";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 w-full z-20 text-black px-4 py-2 flex justify-between items-center shadow-lg border-b-2 snap-start">
      <div className="font-bold">
        <Image src={logo} alt="Brand Logo" width={100} />
      </div>

      <div className="lg:hidden">
        <button className="text-black focus:outline-none" onClick={toggleMenu}>
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

      <div className="hidden lg:flex space-x-8">
        {navlinks.map((link) => (
          <div className="relative group" key={link.name}>
            <a href={link.href} className="">
              {link.name}
            </a>
            <span className="absolute bottom-0 left-0 block w-0 h-[1.5px] bg-custom-db transition-all duration-300 group-hover:w-[70%]"></span>
          </div>
        ))}
      </div>

      <button className="hidden lg:block rounded-full bg-custom-db text-white px-6 py-2">
        Start a Project
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 transform bg-gray-100 bg-opacity-90 w-full h-full transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 h-full flex flex-col justify-center items-center relative">
          <button
            className="absolute top-4 right-4 text-black focus:outline-none"
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

          <nav className="flex flex-col space-y-6 text-xl">
            {navlinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-gray-500 text-center"
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
