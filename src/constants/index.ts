import image from "../assets/aesehi.png";
import hero5 from "@/assets/hero3.png";
import image1 from "@/assets/Digit.png";
import image2 from "@/assets/aesehi.png";
import image3 from "@/assets/hero3.png";
import image4 from "@/assets/hero4.png";

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

export const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euYorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image1,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image2,
  },
  {
    name: "John",
    username: "@john",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image3,
  },
  {
    name: "Jane",
    username: "@jane",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image4,
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image1,
  },
  {
    name: "James",
    username: "@james",
    body: "Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu ",
    img: image2,
  },
];

export type interiorType = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export const interior = [
  // {
  //   name: "Jill",
  //   username: "@jill",
  //   body: "I don't know what to say. I'm speechless. This is amazing.",
  //   img: image2,
  // },
  // {
  //   name: "Jill",
  //   username: "@jill",
  //   body: "I don't know what to say. I'm speechless. This is amazing.",
  //   img: image2,
  // },
  // {
  //   name: "Jill",
  //   username: "@jill",
  //   body: "I don't know what to say. I'm speechless. This is amazing.",
  //   img: image2,
  // },
  {
    id: 1,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 2,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 3,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 4,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 5,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 6,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 7,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 8,
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: image2,
  },
  {
    id: 9,
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image3,
  },
  {
    id: 10,
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image4,
  },
  {
    id: 11,
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image1,
  },
  {
    id: 12,
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    id: 13,
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    id: 14,
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
  {
    id: 15,
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: image2,
  },
];
