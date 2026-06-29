"use client";

import { useDynamicViewportHeight } from "@/hooks/useDynamicViewportHeight";

export default function ViewportHeightSync() {
  useDynamicViewportHeight();
  return null;
}
