"use client";

import Footer from "@/components/sections/Footer";
import { filterAllProjects } from "@/utils/dbActions";

type DeferredFooterProps = {
  data: Awaited<ReturnType<typeof filterAllProjects>>;
};

export default function DeferredFooter({ data }: DeferredFooterProps) {
  return <Footer data={data} />;
}
