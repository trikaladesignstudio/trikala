import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { locationFocusRing } from "@/components/location/locationStyles";
import { cn } from "@/lib/utils";
import Link from "next/link";

type LocationBreadcrumbProps = {
  city?: string;
  className?: string;
};

export default function LocationBreadcrumb({
  city,
  className,
}: LocationBreadcrumbProps) {
  return (
    <Breadcrumb className={cn("mb-4", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className={cn("text-zinc-500 hover:text-zinc-800", locationFocusRing)}>
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {city ? (
            <BreadcrumbLink asChild>
              <Link
                href="/locations"
                className={cn("text-zinc-500 hover:text-zinc-800", locationFocusRing)}
              >
                Locations
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="text-zinc-700">Locations</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {city ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-zinc-700">{city}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
