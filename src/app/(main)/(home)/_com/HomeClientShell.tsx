"use client";

import ClickSpark from "@/components/ui/ClickSpark";
import { resetHeroIntroClock } from "@/lib/heroIntro";
import { useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useLayoutEffect, useState } from "react";

export default function HomeClientShell({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    resetHeroIntroClock();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || prefersReducedMotion) return <>{children}</>;

  return (
    <ClickSpark
      sparkColor="#1A1A1A"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {children}
    </ClickSpark>
  );
}
