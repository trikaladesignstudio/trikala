"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { SlashIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import React from "react";

export default function PathHeading({ className }: { className?: string }) {
  // get the url path
  const pathname = usePathname().split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList className={cn("text-2xl", className)}>
        {pathname.map((item, index) => {
          const itemValue =
            item == "" ? "Home" : item.charAt(0).toUpperCase() + item.slice(1);

          const path = `${pathname.slice(0, index + 1).join("/")}`;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink href={`${path}`}>{itemValue}</BreadcrumbLink>
              </BreadcrumbItem>
              {index !== pathname.length - 1 ? (
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
              ) : null}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
