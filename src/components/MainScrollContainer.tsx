"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function MainScrollContainer({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      id="mainCointainer"
      className={cn(
        "relative flex flex-col overflow-x-hidden scroll-smooth",
        isHome
          ? "h-[100svh] snap-y snap-mandatory overflow-y-auto"
          : "min-h-[100svh] overflow-y-visible"
      )}
    >
      {children}
    </main>
  );
}
