import image from "../assets/aesehi.png";
import hero5 from "@/assets/hero3.png";
import image1 from "@/assets/Digit.png";
import image2 from "@/assets/aesehi.png";
import image3 from "@/assets/hero3.png";
import image4 from "@/assets/hero4.png";
import { StaticImageData } from "next/image";

export const expertise = [
  { image: image, alt: "Image 1" },
  { image: image2, alt: "Image 2" },
  { image: image, alt: "Image 3" },
  { image: image2, alt: "Image 4" },
  { image: image, alt: "Image 5" },
  { image: image2, alt: "Image 6" },
];

export const workingSlides = [
  {
    image: hero5,
    heading: "Heading ",
    description: "Description for the first image.",
  },
  {
    image: hero5,
    heading: "Heading ",
    description: "Description for the second image.",
  },
  {
    image: hero5,
    heading: "Heading",
    description: "Description for the third image.",
  },
  {
    image: hero5,
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
