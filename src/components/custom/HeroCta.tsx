import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { cn } from "@/lib/utils";

type HeroCtaProps = {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
};

export default function HeroCta({
  href,
  label,
  external = false,
  className,
}: HeroCtaProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex h-11 min-h-[44px] shrink-0 items-center gap-2.5 rounded-md px-5",
        "bg-white/95 text-sm font-medium tracking-tight text-custom-db backdrop-blur-sm",
        "shadow-[0_8px_24px_-12px_rgba(23,8,0,0.28)]",
        "transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:bg-white hover:shadow-[0_12px_28px_-12px_rgba(23,8,0,0.34)]",
        "active:scale-[0.98]",
        className,
      )}
    >
      <span>{label}</span>
      <ArrowRightIcon
        className="size-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
