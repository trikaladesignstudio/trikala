"use client";

import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterAllProjects } from "@/utils/dbActions";
import { useScrollContainer } from "@/context/ScrollContainerContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);
import { ContactDataType, navlinks } from "@/types";
import { startAProjectLink } from "@/constants";
import HeroCta from "@/components/custom/HeroCta";
import { scrollToTop, SITE_FOOTER_ID } from "@/lib/scrollToTop";
import { cn } from "@/lib/utils";

const columnLabelClass =
  "font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500";
const columnLinkClass =
  "text-sm text-zinc-100 transition-colors hover:text-zinc-300";

function isNavLinkActive(href: string, pathname: string) {
  const linkPath = new URL(href, "https://trikala.local").pathname;
  if (linkPath === pathname) return true;
  if (linkPath === "/projects" && pathname.startsWith("/projects")) return true;
  return false;
}

function FooterNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={columnLinkClass}
      onClick={(event) => {
        if (isNavLinkActive(href, pathname)) {
          event.preventDefault();
          scrollToTop();
        }
      }}
    >
      {children}
    </Link>
  );
}

const WORDMARK_LINE_HEIGHT = 0.85;
const WORDMARK_VISIBLE_RATIO = 0.78;
const WORDMARK_BASE_FONT_PX = 100;
const FOOTER_OVERLAP = "clamp(2rem, 5vw, 3.5rem)";

function FooterWordmark() {
  const measureRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fitWordmark = () => {
      const measure = measureRef.current;
      const text = textRef.current;
      const crop = cropRef.current;
      if (!measure || !text || !crop) return;

      text.style.fontSize = `${WORDMARK_BASE_FONT_PX}px`;
      text.style.paddingLeft = "0px";

      const targetWidth = measure.clientWidth;
      const textWidth = text.scrollWidth;
      if (!targetWidth || !textWidth) return;

      const fontSize =
        (targetWidth / textWidth) * WORDMARK_BASE_FONT_PX * 0.985;
      text.style.fontSize = `${fontSize}px`;
      text.style.paddingLeft = `${fontSize * 0.012}px`;
      crop.style.height = `${fontSize * WORDMARK_LINE_HEIGHT * WORDMARK_VISIBLE_RATIO}px`;
    };

    fitWordmark();

    const observer = new ResizeObserver(fitWordmark);
    if (measureRef.current) observer.observe(measureRef.current);

    if (document.fonts?.ready) {
      document.fonts.ready.then(fitWordmark);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-x relative mt-10 lg:mt-20">
      <div ref={measureRef} className="w-full">
        <div ref={cropRef} className="overflow-hidden">
          <p
            ref={textRef}
            aria-hidden
            className="pointer-events-none inline-block w-max max-w-none select-none whitespace-nowrap font-silver leading-[0.85] tracking-[-0.02em] text-white"
          >
            Trikala
          </p>
        </div>
      </div>
    </div>
  );
}

function FooterColumn({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <p className={columnLabelClass}>{label}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

const LEGAL_PATHS = new Set(["/privacyPolicy", "/termAndCondition"]);

export default function Footer({
  data,
}: {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const useOverlap = !LEGAL_PATHS.has(pathname);
  const scrollContainer = useScrollContainer();
  const [contactData, setContactData] = useState<ContactDataType[]>([]);

  useEffect(() => {
    if (!isHome) return;

    const container = scrollContainer?.current;
    const scrollTop = container?.scrollTop ?? 0;
    ScrollTrigger.refresh();
    if (container) container.scrollTop = scrollTop;
  }, [isHome, scrollContainer, contactData]);

  useEffect(() => {
    const formatData = data.map((ele) => ({
      title: ele.title,
      description: ele.description,
    }));
    setContactData(formatData);
  }, [data]);

  const regex = /(\w+):\s(https?:\/\/[^\s]+)/g;
  const matches: Record<string, string> = {};
  const socialData = contactData.find((ele) => ele.title === "SOCIAL");
  if (socialData?.description) {
    let match;
    while ((match = regex.exec(socialData.description)) !== null) {
      matches[match[1].toLowerCase()] = match[2];
    }
  }

  const instagramUrl = matches.instagram || "https://instagram.com/example";
  const facebookUrl = matches.facebook || "https://facebook.com/example";
  const youtubeUrl = matches.youtube || "https://youtube.com/example";
  const twitterUrl = matches.twitter || "https://twitter.com/example";

  const address =
    contactData.find((ele) => ele.title === "ADDRESS")?.description ?? "";
  const phone =
    contactData.find((ele) => ele.title === "PHONE")?.description ?? "";
  const email =
    contactData.find((ele) => ele.title === "EMAIL")?.description ?? "";

  const socialLinks = [
    { label: "Instagram", href: instagramUrl, icon: ImInstagram },
    { label: "Facebook", href: facebookUrl, icon: FaFacebookF },
    { label: "YouTube", href: youtubeUrl, icon: FaYoutube },
    { label: "X", href: twitterUrl, icon: FaTwitter },
  ];

  return (
    <footer
      id={SITE_FOOTER_ID}
      className={cn(
        "relative z-0 w-full min-w-0 shrink-0 bg-black text-zinc-100",
        isHome && "snap-start snap-always"
      )}
      style={
        useOverlap
          ? {
              marginTop: `calc(-1 * ${FOOTER_OVERLAP})`,
              paddingTop: FOOTER_OVERLAP,
            }
          : undefined
      }
    >
      <div className="page-x pb-0 pt-10 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_auto_auto_auto] lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
          <div className="space-y-5 lg:max-w-md">
            <p className="text-left text-lg leading-relaxed text-zinc-100 md:text-xl">
              We craft architecture that balances vision, material, and place.
            </p>
            <HeroCta
              href={startAProjectLink}
              label="Start a Project"
              external
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 lg:contents">
            <nav aria-label="Footer navigation" className="min-w-0 text-left">
              <FooterColumn label="Navigate">
                <FooterNavLink href="/">Home</FooterNavLink>
                {navlinks.map((link) => (
                  <FooterNavLink key={link.name} href={link.href}>
                    {link.name}
                  </FooterNavLink>
                ))}
              </FooterColumn>
            </nav>

            <nav aria-label="Social links" className="min-w-0 text-left">
              <FooterColumn label="Connect">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(columnLinkClass, "flex items-center gap-2")}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    {label}
                  </Link>
                ))}
              </FooterColumn>
            </nav>
          </div>

          <div className="space-y-4 text-left">
            <p className={columnLabelClass}>Contact</p>
            <div className="flex flex-col gap-4 text-sm">
              {address ? (
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                    Address
                  </p>
                  <p className="text-zinc-100">{address}</p>
                </div>
              ) : null}
              {phone ? (
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                    Phone
                  </p>
                  <Link
                    href={`tel:${phone}`}
                    className="text-zinc-100 transition-colors hover:text-zinc-300"
                  >
                    {phone}
                  </Link>
                </div>
              ) : null}
              {email ? (
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                    Mail
                  </p>
                  <Link
                    href={`mailto:${email}`}
                    className="text-zinc-100 transition-colors hover:text-zinc-300"
                  >
                    {email}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div className="page-x">
        <div className="relative z-10 flex flex-col gap-4 border-t border-zinc-800 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500 md:text-left">
            &copy; {new Date().getFullYear()} Trikala Architecture Group. All
            rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm md:justify-end">
            <Link
              href="/sitemap.xml"
              className="text-zinc-400 transition-colors hover:text-zinc-300"
            >
              Site Map
            </Link>
            <Link
              href="/privacyPolicy"
              className="text-zinc-400 transition-colors hover:text-zinc-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termAndCondition"
              className="text-zinc-400 transition-colors hover:text-zinc-300"
            >
              T&amp;C
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
