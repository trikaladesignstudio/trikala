"use client";

import { brurRenderVariant, cn, transition } from "@/lib/utils";
import { shimmerBlur } from "@/lib/shimmer";
import { motion } from "framer-motion";
import Image from "next/image";

type AboutHeroProps = {
  heroImage: string;
  inlineImage: string;
};

function AboutHero({ heroImage, inlineImage }: AboutHeroProps) {
  return (
    <section className="w-full bg-[#f5f5f5]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-[2rem] py-10 lg:grid-cols-2 lg:gap-12 lg:px-[5rem] lg:py-16">
        <div className="flex flex-col gap-6 lg:pr-8">
          <h1 className="font-silver text-left text-4xl tracking-tight text-zinc-900 md:text-5xl lg:text-7xl">
            <motion.span
              className="inline-block"
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0 }}
              variants={brurRenderVariant}
              initial="hidden"
              whileInView="visible"
            >
              About
            </motion.span>
            <span className="mx-2 inline-flex align-middle md:mx-3">
              <motion.span
                className="relative inline-block h-[0.75em] w-[1.1em] overflow-hidden rounded-md md:h-[0.85em] md:w-[1.25em] md:rounded-lg"
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.15 }}
                variants={brurRenderVariant}
                initial="hidden"
                whileInView="visible"
              >
                <Image
                  src={inlineImage}
                  alt="Trikala Architects project detail"
                  fill
                  sizes="80px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={shimmerBlur}
                />
              </motion.span>
            </span>
            <motion.span
              className="inline-block"
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.3 }}
              variants={brurRenderVariant}
              initial="hidden"
              whileInView="visible"
            >
              us
            </motion.span>
          </h1>

          <motion.p
            className="max-w-[65ch] text-left text-sm leading-relaxed text-zinc-600 md:text-base"
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.45 }}
            variants={brurRenderVariant}
            initial="hidden"
            whileInView="visible"
          >
            Trikala Architects, founded by Tanya Agarwal in 2020, specializes in
            innovative, sustainable design across Master Planning, Residential,
            Commercial, Institutional, and Interiors, with expertise in
            Sustainability, Landscape, and Digital Technologies. Based in India,
            the firm delivers functional, aesthetic, and environmentally
            responsible solutions, driven by creative excellence and a
            client-focused approach, aiming to inspire communities through
            impactful architecture.
          </motion.p>

          <div className="h-px w-12 bg-custom-lb" />
        </div>

        <motion.div
          className={cn(
            "relative w-full overflow-hidden",
            "aspect-[4/5] min-h-[16rem]",
            "lg:aspect-auto lg:min-h-[min(70svh,36rem)]"
          )}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
          variants={brurRenderVariant}
          initial="hidden"
          whileInView="visible"
        >
          <Image
            src={heroImage}
            alt="Trikala Architects project showcase"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={shimmerBlur}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

export default AboutHero;
