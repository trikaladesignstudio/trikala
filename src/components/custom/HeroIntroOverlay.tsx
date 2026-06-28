"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

type HeroIntroOverlayProps = {
  opacity: MotionValue<number>;
};

export default function HeroIntroOverlay({ opacity }: HeroIntroOverlayProps) {
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.01 ? "auto" : "none"
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white"
      style={{ opacity, pointerEvents }}
    />
  );
}
