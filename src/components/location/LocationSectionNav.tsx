"use client";

import { locationFocusRing } from "@/components/location/locationStyles";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "services", label: "Services" },
  { id: "estimate", label: "Pricing" },
  { id: "projects", label: "Projects" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
] as const;

export default function LocationSectionNav() {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-0 z-30 border-b border-zinc-200/60 bg-custom-canvas/95 backdrop-blur-sm"
    >
      <div className="page-x">
        <ul className="flex gap-1 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  className={cn(
                    "relative inline-flex h-11 min-h-[44px] items-center px-4 text-sm font-medium transition-colors",
                    isActive ? "text-custom-lb" : "text-zinc-600 hover:text-zinc-900",
                    locationFocusRing,
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {label}
                  {isActive ? (
                    <span
                      className="absolute inset-x-4 bottom-2 h-0.5 rounded-full bg-custom-lb motion-safe:transition-transform"
                      aria-hidden
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
