"use client";

import React, { memo, use, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Prisma } from "@prisma/client";

import FramedHeroShell from "@/components/custom/FramedHeroShell";
import HeroHeadline from "@/components/custom/HeroHeadline";
import { signalHeroImageReady } from "@/lib/heroIntro";
import { shimmerBlur } from "@/lib/utils";

function getHeroImageUrls(data: Prisma.ProjectCreateInput[]) {
  const projectImages = data
    .map((project) => project?.images)
    .flat()
    .map((image) => image?.url)
    .flat()
    .filter((url): url is string => Boolean(url));

  if (projectImages.length === 0) {
    return ["/static/logo.webp"];
  }

  return projectImages;
}

export default memo(function Hero({
  pData,
}: {
  pData: Promise<Prisma.ProjectCreateInput[]>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = use(pData);
  const allImages = useMemo(() => getHeroImageUrls(data), [data]);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const images = useMemo(
    () => [allImages[0], ...extraImages].filter((url): url is string => Boolean(url)),
    [allImages, extraImages]
  );

  const handlePriorityImageReady = useCallback(() => {
    queueMicrotask(() => signalHeroImageReady());
  }, []);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const timeouts = allImages.slice(1).map((image, index) =>
      window.setTimeout(() => {
        setExtraImages((prev) => [...prev, image]);
      }, (index + 1) * 6000)
    );

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [allImages]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <FramedHeroShell
      background={
        <>
          {images.map((image, index) => (
            <Image
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              src={image}
              fill
              sizes="100vw"
              alt={`Trikala Architects project ${index + 1}`}
              key={image}
              blurDataURL={shimmerBlur}
              placeholder="blur"
              onLoad={index === 0 ? handlePriorityImageReady : undefined}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                currentIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </>
      }
      headline={<HeroHeadline text="Trikala Architects" />}
    />
  );
});
