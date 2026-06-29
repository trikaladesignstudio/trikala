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
  startAProjectLink,
}: {
  pData: Promise<Prisma.ProjectCreateInput[]>;
  startAProjectLink: string;
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
    const url = allImages[0];
    if (!url) {
      handlePriorityImageReady();
      return;
    }

    const img = new window.Image();
    const onReady = () => handlePriorityImageReady();

    img.onload = onReady;
    img.onerror = onReady;
    img.src = url;

    if (img.complete && img.naturalWidth > 0) {
      onReady();
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [allImages, handlePriorityImageReady]);

  const priorityImageRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        handlePriorityImageReady();
      }
    },
    [handlePriorityImageReady]
  );

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
      startAProjectLink={startAProjectLink}
      background={
        <>
          {images.map((image, index) => (
            <Image
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              ref={index === 0 ? priorityImageRef : undefined}
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
