"use client";

import LazyMount from "@/components/custom/LazyMount";
import { filterAllProjects } from "@/utils/dbActions";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
  loading: () => null,
});

type DeferredFooterProps = {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
};

export default function DeferredFooter({ data }: DeferredFooterProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) {
    return <Footer data={data} />;
  }

  return (
    <LazyMount>
      <Footer data={data} />
    </LazyMount>
  );
}
