import image from "../assets/aesehi.png";
import hero5 from "@/assets/hero3.png";
import image1 from "@/assets/Digit.png";
import image2 from "@/assets/aesehi.png";
import image3 from "@/assets/hero3.png";
import image4 from "@/assets/hero4.png";
import { StaticImageData } from "next/image";

interface NavLink {
  name: string;
  href: string;
}

import dimg1 from "@/assets/1.jpeg";
import dimg2 from "@/assets/2.jpeg";
import dimg3 from "@/assets/3.jpeg";
import dimg4 from "@/assets/4.jpeg";

export const dummyImages = [
  {
    img: dimg1,
  },
  {
    img: dimg2,
  },
  {
    img: dimg3,
  },
  {
    img: dimg4,
  },
];

export const navlinks: NavLink[] = [
  { name: "Home", href: "#" },
  { name: "Process", href: "#" },
  { name: "Solutions", href: "#" },
  { name: "Price Estimate", href: "#" },
];

export const expertise = [
  { image: dimg1, alt: "Image 1" },
  { image: dimg2, alt: "Image 2" },
  { image: dimg3, alt: "Image 3" },
  { image: dimg4, alt: "Image 4" },
  { image: image, alt: "Image 5" },
];

export const workingSlides = [
  {
    image: dimg1,
    heading: "Heading ",
    description: "Description for the first image.",
  },
  {
    image: dimg2,
    heading: "Heading ",
    description: "Description for the second image.",
  },
  {
    image: dimg3,
    heading: "Heading",
    description: "Description for the third image.",
  },
  {
    image: dimg4,
    heading: "Heading ",
    description: "Description for the fourth image.",
  },
  {
    image: hero5,
    heading: "Heading ",
    description: "Description for the fifth image.",
  },
];

export type interiorType = {
  name: string;
  username: string;
  body: string;
  img: StaticImageData;
};

export const interior = [
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image3,
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image4,
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image1,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
];
