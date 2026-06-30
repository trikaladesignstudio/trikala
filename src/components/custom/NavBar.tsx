"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import StaggeredMenu from "@/components/custom/StaggeredMenu";
import { cn } from "@/lib/utils";
import { navlinks } from "@/types";

const navLabel =
  "text-[13px] font-normal uppercase leading-none tracking-normal text-[#222F30]";

const SIZES = {
  hero: {
    row: "py-4 lg:py-6",
    logo: "h-[3.3rem] w-auto lg:h-[4.56rem]",
    pill: "h-11 lg:h-[3.375rem]",
    link: "h-[calc(2.75rem-0.875rem)] lg:h-[calc(3.375rem-0.875rem)]",
    cta: "h-[calc(2.75rem-0.5rem)] lg:h-[calc(3.375rem-0.5rem)]",
  },
  default: {
    row: "py-3 lg:py-3.5",
    logo: "h-[2.84rem] w-auto lg:h-[3.8rem]",
    pill: "h-9 lg:h-11",
    link: "h-[calc(2.25rem-0.875rem)] lg:h-[calc(2.75rem-0.875rem)]",
    cta: "h-[calc(2.25rem-0.5rem)] lg:h-[calc(2.75rem-0.5rem)]",
  },
} as const;

const Navbar = ({ startAProjectLink }: { startAProjectLink: string }) => {
  const isOverlay = usePathname() === "/";
  const s = SIZES[isOverlay ? "hero" : "default"];

  const inner = (
    <div className={cn("page-x flex items-center justify-between", s.row)}>
      <Link href="/" className="shrink-0">
        <Image
          priority
          src="/static/logo.webp"
          alt="Trikala Architects"
          width={120}
          height={120}
          className={cn(s.logo, "invert")}
        />
      </Link>

      <div
        className="hidden shrink-0 items-center lg:flex"
        aria-label="Primary navigation"
      >
        <div
          className={cn(
            "inline-flex items-center gap-3 rounded-xl border border-[#222F30]/5 bg-white/80 py-1 pl-3 pr-1 backdrop-blur-[14px]",
            s.pill
          )}
        >
          {navlinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                navLabel,
                "inline-flex items-center rounded-lg px-[17px] transition-colors hover:bg-[#222F30]/5",
                s.link
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={startAProjectLink}
            className={cn(
              navLabel,
              "inline-flex shrink-0 items-center rounded-lg bg-[#222F30] px-5 text-white transition-colors hover:bg-[#222F30]/90 active:scale-[0.98]",
              s.cta
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Start a Project
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-5 lg:hidden">
        <Link
          href={startAProjectLink}
          className={cn(
            navLabel,
            "text-custom-premium transition-colors hover:text-white"
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Inquire
        </Link>
        <StaggeredMenu
          embedded
          hideLogo
          items={navlinks.map((link) => ({
            label: link.name,
            ariaLabel: `Go to ${link.name}`,
            link: link.href,
          }))}
          cta={{
            label: "Start a Project",
            link: startAProjectLink,
            ariaLabel: "Start a project with Trikala",
            external: true,
          }}
        />
      </div>
    </div>
  );

  if (isOverlay) {
    return (
      <nav className="absolute inset-x-0 top-0 z-30 bg-transparent">
        {inner}
      </nav>
    );
  }

  return <nav className="relative z-30 w-full">{inner}</nav>;
};

export default Navbar;
