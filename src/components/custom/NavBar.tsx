"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import StaggeredMenu from "@/components/custom/StaggeredMenu";
import { startAProjectLink } from "@/constants";
import { cn } from "@/lib/utils";
import { navlinks } from "@/types";

const linkClassName =
  "text-sm font-normal uppercase tracking-[0.2em] text-white/90 transition-colors hover:text-white";

const ctaClassName =
  "text-sm font-normal uppercase tracking-[0.2em] text-custom-lb transition-colors hover:text-custom-premium active:-translate-y-[1px]";

const mobileMenuItems = navlinks.map((link) => ({
  label: link.name,
  ariaLabel: `Go to ${link.name}`,
  link: link.href,
}));

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
      className={cn(
        "z-20 flex w-full snap-start flex-row items-center justify-between",
        isHome
          ? "absolute left-0 right-0 top-0 px-4 py-5 lg:px-12 lg:py-6"
          : "relative px-4 py-3 lg:px-12"
      )}
    >
      <Link href="/" className="shrink-0">
        <Image
          priority
          src="/static/logo.webp"
          alt="Trikala Architects"
          width={88}
          height={88}
          className="invert"
        />
      </Link>

      <div className="hidden items-center gap-10 lg:flex">
        {navlinks.map((link) => (
          <Link key={link.name} href={link.href} className={linkClassName}>
            {link.name}
          </Link>
        ))}
        <Link
          href={startAProjectLink}
          className={ctaClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          Start a Project
        </Link>
      </div>

      <div className="flex items-center gap-6 lg:hidden">
        <Link
          href={startAProjectLink}
          className={ctaClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          Inquire
        </Link>
        <StaggeredMenu
          embedded
          hideLogo
          position="right"
          items={mobileMenuItems}
          cta={{
            label: "Start a Project",
            link: startAProjectLink,
            ariaLabel: "Start a project with Trikala",
            external: true,
          }}
          displaySocials={false}
          displayItemNumbering
          colors={["#D1C1A4", "#774931"]}
          accentColor="#774931"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#170800"
          changeMenuColorOnOpen
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
