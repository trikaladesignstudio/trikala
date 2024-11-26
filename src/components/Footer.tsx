import Image from "next/image";
import logo from "../assets/logo.png";
import React from "react";
import { FaLinkedinIn, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";

function Footer() {
  return (
    <footer className="grid gap-10 lg:gap-20 px-[5vw] py-10 snap-end snap-always shrink-0">
      <hr className="border-t border-gray-300" />

      <div className="grid lg:grid-cols-4 grid-cols-1 justify-between text-center lg:text-left gap-12">
        <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
          <p className="lg:w-[20vw]">
            <Image src={logo} alt="" className="lg:w-[20vw] w-[30vw]" />
            Learn to build a fashion startup from someone who has been there and
            done that.
          </p>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-[1.5em] font-bold">COURSE</h1>
            <a href="">Home</a>
            <a href="">Featured</a>
            <a href="">Process</a>
            <a href="">Solutions</a>
            <a href="">Price Estimate</a>
            <a href="">Clients</a>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[1.5em] font-bold">SUPPORT</h1>
            <a href="">Contact</a>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[1.5em] font-bold">LEGAL</h1>
            <a href="">Terms of Use</a>
            <a href="">Terms & Conditions</a>
            <a href="">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end gap-6 lg:gap-10">
        <a href="" className="text-4xl lg:text-2xl">
          <FaLinkedinIn />
        </a>
        <a href="" className="text-4xl lg:text-2xl">
          <ImInstagram />
        </a>
        <a href="" className="text-4xl lg:text-2xl">
          <FaFacebookF />
        </a>
        <a href="" className="text-4xl lg:text-2xl">
          <FaTwitter />
        </a>
        <a href="" className="text-4xl lg:text-2xl">
          <FaYoutube />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
