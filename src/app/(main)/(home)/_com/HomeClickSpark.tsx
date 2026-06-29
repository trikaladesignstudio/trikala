"use client";

import ClickSpark from "@/components/ui/ClickSpark";
import { useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";

export default function HomeClickSpark({
  children,
}: {
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

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
