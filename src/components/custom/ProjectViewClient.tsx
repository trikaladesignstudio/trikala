"use client";

import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import dynamic from "next/dynamic";
import Heading from "./Heading";
const RenderPdf = dynamic(() => import("./RenderPdf"), {
  ssr: false,
});

export default function ProjectViewClient({
  projectData,
}: {
  projectData: Prisma.ProjectCreateInput;
}) {
  const [project, _] = useState<Prisma.ProjectCreateInput>(projectData);

  return (
    <div className="flex flex-col gap-4 min-h-full w-full justify-start">
      <Heading className="text-left " text={project.title} />
      <p className="text-lg ">{project.description}</p>
      <p className="text-lg border border-black w-full" />
      {projectData.pdf && (
        <div className="flex-1 w-full min-h-screen">
          <RenderPdf url={projectData.pdf.url as string} />
        </div>
      )}
    </div>
  );
}
